import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import session from "koa-session";
import { ApolloServer } from "apollo-server-koa";
import typeDefs from "./apollo/typeDefs";
import resolvers from "./apollo/resolvers";
import * as handlers from "./handlers/index";
dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev
});
const handle = app.getRequestHandler();
const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY, SCOPES } = process.env;
console.log('shopify api secret', SHOPIFY_API_SECRET_KEY)
console.log('shopify key', SHOPIFY_API_KEY)
app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(
    session(
      {
        sameSite: "none",
        secure: true
      },
      server
    )
  );
  server.keys = [SHOPIFY_API_SECRET_KEY];
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ["read_products", "read_orders", "write_orders", "read_customers", "write_customers", "read_draft_orders", "write_draft_orders", "read_customers", "write_customers"],
      async afterAuth(ctx) {
        //Auth token and shop available in session
        //Redirect to shop upon auth
        const { shop, accessToken } = ctx.session;
        console.log('after auth')
        console.log('shop', shop)
        console.log('access token', accessToken)
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: "none"
        });
        ctx.redirect("/");
      }
    })
  );
  
  router.get("*", verifyRequest(), async ctx => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });
  server.use(router.allowedMethods());
  server.use(router.routes());
  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ ctx }) => ({ ctx })
  });
  apollo.applyMiddleware({ app: server, cors: { credentials: "include" } });
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
