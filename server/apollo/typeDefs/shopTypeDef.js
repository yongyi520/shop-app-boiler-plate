import { gql } from "apollo-server-koa";

export default gql`
  extend type Query {
    me: String
    meShopOnboard: Onboard
    meWebhooks: Boolean
    meSettings: [ShopSetting]
    getShopSettingsDev(shop: String!): [ShopSetting]
    getShopSetting(id: String): ShopSetting
    getShopWebhooks: Boolean
    shopInstalled(shopUrl: String!): Boolean
  }

  type Shop {
    id: ID!
    name: String!
    status: String!
    url: String!
    token: String!
    onboard: Onboard
  }


  type Onboard {
    id: ID!
    setting: Boolean
    dashboard: Boolean
  }

  input OnboardInput {
    id: ID!
    setting: Boolean
    dashboard: Boolean
  }
`;
