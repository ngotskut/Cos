import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * Auth Callback Page
 * Handles the redirect from Mr. Silent Portal with token params.
 * AuthContext already processes the token on mount, so this page
 * just shows a brief loading state then redirects.
 */
export default function AuthCallback() {
    const { isAuthenticated, loading, authMessage } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (isAuthenticated) {
                // Small delay so user can see success message
                const timer = setTimeout(() => {
                    navigate("/dashboard", { replace: true });
                }, 1500);
                return () => clearTimeout(timer);
            } else {
                // Auth failed, redirect to home
                const timer = setTimeout(() => {
                    navigate("/", { replace: true });
                }, 2000);
                return () => clearTimeout(timer);
            }
        }
    }, [isAuthenticated, loading, navigate]);

    return (
        <div className="auth-callback-page">
            <div className="auth-callback-card">
                <div className="auth-callback-icon">
                    {loading ? (
                        <div className="loading-spinner large" />
                    ) : isAuthenticated ? (
                        <div className="success-icon">✅</div>
                    ) : (
                        <div className="error-icon">❌</div>
                    )}
                </div>

                <h2>
                    {loading
                        ? "Memproses login..."
                        : isAuthenticated
                            ? "Login Berhasil!"
                            : "Login Gagal"}
                </h2>

                {authMessage && <p className="auth-message">{authMessage}</p>}

                <p className="auth-redirect-text">
                    {loading
                        ? "Mengambil data dari portal..."
                        : isAuthenticated
                            ? "Mengalihkan ke dashboard..."
                            : "Mengalihkan ke halaman utama..."}
                </p>

                {isAuthenticated && (
                    <p className="auth-tip">
                        💡 Kamu bisa kembali ke bot Telegram setelah ini
                    </p>
                )}
            </div>
        </div>
    );
}
