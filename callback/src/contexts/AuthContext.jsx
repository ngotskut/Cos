import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import {
    buildGatewayURL,
    saveSession,
    loadSession,
    clearSession,
    processCallbackParams,
    checkWhitelist,
} from "../utils/auth";
import { trackUser } from "../utils/analytics";

const AuthContext = createContext(null);

const WHITELIST_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authMessage, setAuthMessage] = useState(null);
    const whitelistIntervalRef = useRef(null);

    // Periodic whitelist re-validation
    const startWhitelistCheck = useCallback((userEmail) => {
        if (whitelistIntervalRef.current) {
            clearInterval(whitelistIntervalRef.current);
        }

        whitelistIntervalRef.current = setInterval(async () => {
            const allowed = await checkWhitelist(userEmail);
            if (!allowed) {
                // Force logout if whitelist revoked
                clearSession();
                setUser(null);
                setAuthMessage("⚠️ Akses Anda telah dicabut oleh admin.");
                clearInterval(whitelistIntervalRef.current);
            }
        }, WHITELIST_CHECK_INTERVAL);
    }, []);

    // On mount: check localStorage or URL callback params
    useEffect(() => {
        // 1. Check URL callback params first (from portal redirect)
        const callbackResult = processCallbackParams();

        if (callbackResult) {
            const { user: authUser, token } = callbackResult;
            saveSession(authUser, token);
            setUser(authUser);
            setAuthMessage("✅ Login berhasil!");

            // Track user analytics
            trackUser(authUser.email);

            // Start whitelist periodic check
            startWhitelistCheck(authUser.email);

            // Clean up URL params
            const url = new URL(window.location.href);
            url.search = "";
            window.history.replaceState({}, "", url.pathname);

            setLoading(false);
            return;
        }

        // 2. Check localStorage for existing session
        const session = loadSession();
        if (session) {
            setUser(session.user);
            startWhitelistCheck(session.user.email);
        }

        setLoading(false);
    }, [startWhitelistCheck]);

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (whitelistIntervalRef.current) {
                clearInterval(whitelistIntervalRef.current);
            }
        };
    }, []);

    const login = useCallback(() => {
        const url = buildGatewayURL("/auth/callback");
        window.location.href = url;
    }, []);

    const logout = useCallback(() => {
        clearSession();
        setUser(null);
        setAuthMessage(null);
        if (whitelistIntervalRef.current) {
            clearInterval(whitelistIntervalRef.current);
        }
    }, []);

    const value = {
        user,
        loading,
        authMessage,
        setAuthMessage,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export default AuthContext;
