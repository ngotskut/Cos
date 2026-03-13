const ANALYTICS_URL = "https://portal.mystr.xyz/api/functions/v1/report-analytics";
const API_KEY = import.meta.env.VITE_CENTRAL_API_KEY;
const APP_NAME = import.meta.env.VITE_APP_NAME || "OTP Hero";

/**
 * Track a page visit (fire-and-forget)
 * Each refresh = +1 visitor
 */
export function trackVisit() {
  fetch(ANALYTICS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: API_KEY,
      app_name: APP_NAME,
      type: "visit",
    }),
  }).catch(() => {}); // fire-and-forget
}

/**
 * Track a unique user login (fire-and-forget)
 * 1 email = 1 unique user
 */
export function trackUser(email) {
  fetch(ANALYTICS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: API_KEY,
      app_name: APP_NAME,
      type: "user",
      email,
    }),
  }).catch(() => {}); // fire-and-forget
}
