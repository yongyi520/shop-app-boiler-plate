import mongoose, { Schema } from "mongoose";

const shopSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  hmac: {
    type: String
  },
  settings: [
    {
      type: Schema.Types.ObjectId,
      ref: "ShopSetting"
    }
  ],
  // pricePlans: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "PricePlan"
  //   }
  // ],
  onboard: {
    type: Schema.Types.ObjectId,
    ref: "Onboard"
  }
});

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;
