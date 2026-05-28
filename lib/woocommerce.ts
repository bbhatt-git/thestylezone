import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

// Assuming we configure these in `.env.example` and the app environment
const woocommerceURL = process.env.WOOCOMMERCE_URL || "";
const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || "";
const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || "";

let wcApi: WooCommerceRestApi | null = null;

if (woocommerceURL && consumerKey && consumerSecret) {
  wcApi = new WooCommerceRestApi({
    url: woocommerceURL,
    consumerKey: consumerKey,
    consumerSecret: consumerSecret,
    version: "wc/v3"
  });
}

export const woocommerce = wcApi;
