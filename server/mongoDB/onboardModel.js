import mongoose, { Schema } from "mongoose";

const onboardSchema = new Schema({
  dashboard: {
    type: Boolean,
    default: false,
    required: true
  },
  setting: {
    type: Boolean,
    default: false,
    required: true
  }
});

const Onboard = mongoose.model("Onboard", onboardSchema);

export default Onboard;
