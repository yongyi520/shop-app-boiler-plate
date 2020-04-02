import Shopify from "shopify-api-node";
import _ from "lodash";

export const createNewShopifyApiSession = ctx => {
  if (ctx && ctx.session && ctx.session.shop && ctx.session.accessToken) {
    const [shopName] = _.split(ctx.session.shop, ".myshopify.com");
    return new Shopify({
      shopName,
      accessToken: ctx.session.accessToken
    });
  }
  return null;
};

export const createNewShopify = (shopName, accessToken) => {
  if (!shopName || !accessToken) {
    return null;
  }
  return new Shopify({
    shopName,
    accessToken
  });
};

export const getAcceptedAndActivePlans = async shopify => {
  const recurringPaymentPlans = await shopify.recurringApplicationCharge.list();
  // console.log('recurringPaymentPlans', recurringPaymentPlans)
  const activePlans = recurringPaymentPlans
    ? _.filter(recurringPaymentPlans, plan => plan.status === "active")
    : null;
    // console.log('active plans', activePlans)
  const acceptedPlans = recurringPaymentPlans
    ? _.filter(recurringPaymentPlans, plan => plan.status === "accepted")
    : null;
    // console.log('accepted plans', acceptedPlans)
  return [acceptedPlans, activePlans]
};

export const createStandardPaymentPlan = async (shopify, returnUrl, test) => {
  return await shopify.recurringApplicationCharge.create({
    name: "Standard",
    price: 19.99,
    return_url: returnUrl,
    trial_days: 7,
    test: test
  });
}