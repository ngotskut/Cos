const GATEWAY_URL = "https://portal.mystr.xyz/auth/gateway";
const CHECK_WHITELIST_URL = "https://portal.mystr.xyz/api/functions/v1/check-whitelist";
const API_KEY = import.meta.env.VITE_CENTRAL_API_KEY;
const APP_NAME = import.meta.env.VITE_APP_NAME || "OTP Hero";

const AUTH_STORAGE_KEY = "otp_hero_auth";

/**
 * Decode JWT payload (base64url → JSON)
 * NOTE: For production, verify token server-side with HMAC-SHA256
 */
export function decodeJwtPayload(token) {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;

        // Base64url → Base64
        let payload = parts[1];
        payload = payload.replace(/-/g, "+").replace(/_/g, "/");

        // Add padding
        const pad = payload.length % 4;
        if (pad) payload += "=".repeat(4 - pad);

        const decoded = atob(payload);
        return JSON.parse(decoded);
    } catch {
        return null;
    }
}

/**
 * Build the gateway redirect URL
 */
export function buildGatewayURL(callbackPath = "/auth/callback") {
    const redirectUri = window.location.origin + callbackPath;

    const params = new URLSearchParams({
        api_key: API_KEY,
        redirect_uri: redirectUri,
        app_name: APP_NAME,
    });

    return `${GATEWAY_URL}?${params.toString()}`;
}

/**
 * Save user session to localStorage
 */
export function saveSession(user, token) {
    const session = {
        user,
        token,
        savedAt: Date.now(),
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

/**
 * Load user session from localStorage (returns null if expired/invalid)
 */
export function loadSession() {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return null;

        const session = JSON.parse(raw);
        if (!session || !session.user || !session.token) return null;

        // Check JWT expiry
        const payload = decodeJwtPayload(session.token);
        if (!payload || !payload.exp) return null;

        const now = Math.floor(Date.now() / 1000);
        if (payload.exp <= now) {
            // Token expired, clear session
            clearSession();
            return null;
        }

        return session;
    } catch {
        clearSession();
        return null;
    }
}

/**
 * Clear session from localStorage
 */
export function clearSession() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
}

/**
 * Check whitelist status via Mr. Silent Portal API
 */
export async function checkWhitelist(email, appName = APP_NAME) {
    try {
        const res = await fetch(CHECK_WHITELIST_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                api_key: API_KEY,
                email,
                app_name: appName,
            }),
        });

        if (!res.ok) return false;
        const data = await res.json();
        return data.allowed === true;
    } catch {
        return false;
    }
}

/**
 * Process callback params from URL after portal redirect
 * Returns { user, token } or null
 */
export function processCallbackParams() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");

    if (!token) return null;

    const payload = decodeJwtPayload(token);
    if (!payload) return null;

    // Check expiry
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp <= now) return null;

    const user = {
        email: email || payload.email || payload.sub || "",
        app_name: payload.app_name || APP_NAME,
        whitelisted: payload.whitelisted !== false,
        membership: payload.membership || null,
        auth_method: payload.auth_method || null,
    };

    return { user, token };
}
