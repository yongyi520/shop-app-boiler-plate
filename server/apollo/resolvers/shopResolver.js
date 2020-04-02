import { createNewShopifyApiSession } from "../../lib/shopifyApi";
import _ from "lodash";
// import { metafieldNamespace } from "../../lib/constants";

import { Shop, ShopSetting, Onboard } from "../../mongoDB";

const DEFAULT_SHOP_SETTING = {
  name: "Untitled",
  enabled: false,
};

export default {
  Query: {
    shopInstalled: async (parentValue, args, { ctx }, info) => {
      const { shopUrl } = args;
      const shopDetails = await Shop.findOne({ url: shopUrl });
      console.log("shop url", shopUrl);
      console.log("shop detail", shopDetails);
      if (shopDetails) {
        return (
          shopDetails.status === "INSTALLED" ||
          shopDetails.status === "REINSTALLED"
        );
      }
      return false;
    },
    me: async (parentValue, args, { ctx }, info) => {
      console.log("me query");
      const shopify = createNewShopifyApiSession(ctx);
      console.log("ctx session", ctx.session);
      // const nhatMetafield = await shopify.metafield.list({
      //   namespace: metafieldNamespace
      // });
      // console.log("nhat meta field query", nhatMetafield);
      return ctx.session.shop;
    },
    meShopOnboard: async (parentValue, args, { ctx }, info) => {
      // ---
      // PROD
      if (!ctx.session && !ctx.session.shop) {
        return null;
      }
      const { shop } = ctx.session;
      // DEV
      // const shop = "secondsweetstore.myshopify.com";
      // ----
      const shopDetails = await Shop.findOne({ url: shop });
      console.log("shop detail", shopDetails);
      if (!shopDetails) return null;
      if (shopDetails.onboard) {
        const shopOnboard = await Onboard.findOne({ _id: shopDetails.onboard });
        return shopOnboard;
      }
      return null;
    },
    meSettings: async (parentValue, args, { ctx }, info) => {
      if (!ctx.session && !ctx.session.shop) {
        return null;
      }
      const { shop } = ctx.session;
      // DEV
      // const shop = "secondsweetstore.myshopify.com";
      // ------
      const shopDetails = await Shop.findOne({ url: shop });
      if (!shopDetails) return null;

      const shopSettings = await ShopSetting.find({
        _id: { $in: shopDetails.settings }
      });
      console.log("meSettings");
      console.log("ctx session", ctx.session);
      console.log("shop url", shop);
      console.log("shop details", shopDetails);
      console.log("shop settings", shopSettings);

      return shopSettings;
    },
    meWebhooks: async (parentValue, args, { ctx }, info) => {
      const shopify = createNewShopifyApiSession(ctx);
      const webhooks = await shopify.webhook.list();
      console.log("me webhooks", webhooks);
    },
    getShopSettingsDev: async (parentValue, { shop }, { ctx }, info) => {
      const shopDetails = await Shop.findOne({ url: shop });
      const shopSettings = await ShopSetting.find({
        _id: { $in: shopDetails.settings }
      });
      return shopSettings;
    },
    getShopSetting: async (parentValue, { id }, { ctx }, info) => {
      if (!ctx.session && !ctx.session.shop) {
        return null;
      }
      const { shop } = ctx.session;
      const shopDetails = await Shop.findOne({ url: shop });
      const shopSettingDetails = await ShopSetting.findOne({ _id: id });
      console.log("shop settings details", shopSettingDetails);
      if (
        !shopDetails &&
        !shopSettingDetails &&
        !_.includes(shopDetails.settings, id)
      )
        return null;
      return shopSettingDetails;
    },
    // getMonthlySubscription: async (parentValue, args, { ctx }, info) => {
    //   console.log("get monthly subscription");
    //   const shopify = createNewShopifyApiSession(ctx);
    //   console.log("ctx.session", ctx.session);
    //   const recurringCharges = await shopify.recurringApplicationCharge.list();
    //   console.log("recurring charges", recurringCharges);
    //   const filteredPlans = _.filter(
    //     recurringCharges,
    //     charge => charge.status === "accepted" || charge.status === "active"
    //   );
    //   console.log("filtered charges", filteredPlans);
    //   return _.map(filteredPlans, plan => {
    //     return {
    //       planId: plan.id,
    //       name: plan.name,
    //       price: parseFloat(plan.price),
    //       status: plan.status,
    //       billingOn: plan.billing_on,
    //       createdAt: new Date(plan.created_at),
    //       updatedAt: new Date(plan.updated_at),
    //       test: plan.test,
    //       trialDays: plan.trial_days
    //     };
    //   });
    // },
    getShopWebhooks: async (parentValue, args, { ctx }, info) => {
      const shopify = createNewShopifyApiSession(ctx);
      const webhooks = await shopify.webhook.list();
      console.log("webhooks list", webhooks);
    }
  }
};
