import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import fetch from "node-fetch";
import App, { Container } from "next/app";
import { AppProvider } from "@shopify/polaris";
import { Provider } from "@shopify/app-bridge-react";
import Cookies from "js-cookie";
import "@shopify/polaris/styles.css";
import "shepherd.js/dist/css/shepherd.css";
import "../styles.scss";
import translations from "@shopify/polaris/locales/en.json";

const client = new ApolloClient({
  uri: "https://c125cbae.ngrok.io/graphql", // website for dev or prod
  fetch: fetch,
  credentials: "include"
});
class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    const shopOrigin = Cookies.get("shopOrigin");
    // console.log("shop origin in myApp", shopOrigin);
    return (
      <AppProvider i18n={translations}>
        <Provider
          config={{
            apiKey: process.env.API_KEY,
            shopOrigin: shopOrigin,
            forceRedirect: true
          }}
        >
          <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
        </Provider>
      </AppProvider>
    );
  }
}

export default MyApp;
