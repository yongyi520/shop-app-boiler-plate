import mongoose, { Schema } from "mongoose";



const shopSettingSchema = new Schema({
  enabled: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    required: true,
    default: "Untitled"
  },
});

const ShopSetting = mongoose.model("ShopSetting", shopSettingSchema);

export default ShopSetting;
