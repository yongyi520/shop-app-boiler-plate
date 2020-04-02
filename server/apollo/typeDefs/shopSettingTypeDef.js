import { gql } from "apollo-server-koa";

export default gql`
  type ShopSetting {
    id: ID
    enabled: Boolean
    name: String
  }

  input ShopSettingInput {
    id: ID
    enabled: Boolean
    name: String
  }
`;
