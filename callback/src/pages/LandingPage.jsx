import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function LandingPage() {
    const { login, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
    }, [isAuthenticated, loading, navigate]);

    return (
        <div className="landing-page">
            {/* Animated background particles */}
            <div className="bg-particles">
                <div className="particle particle-1" />
                <div className="particle particle-2" />
                <div className="particle particle-3" />
                <div className="particle particle-4" />
                <div className="particle particle-5" />
            </div>

            <div className="landing-container">
                {/* Hero Section */}
                <div className="hero-section">
                    <div className="hero-badge">
                        <span className="badge-icon">🤖</span>
                        <span>Telegram Bot</span>
                    </div>

                    <h1 className="hero-title">
                        <span className="title-gradient">OTP Hero</span>
                        <span className="title-sub">Authentication Portal</span>
                    </h1>

                    <p className="hero-description">
                        Login untuk mengakses bot OTP WhatsApp. Setelah login, kamu bisa
                        langsung menggunakan bot di Telegram.
                    </p>

                    {/* Login Card */}
                    <div className="login-card">
                        <div className="card-glow" />

                        <div className="card-header">
                            <div className="shield-icon">🔐</div>
                            <h2>Masuk ke OTP Hero</h2>
                            <p>Login menggunakan Google atau Passkey</p>
                        </div>

                        <button
                            id="login-button"
                            className="login-btn"
                            onClick={login}
                            disabled={loading}
                        >
                            <span className="btn-icon">🚀</span>
                            <span className="btn-text">
                                {loading ? "Memuat..." : "Login dengan Portal"}
                            </span>
                            <span className="btn-arrow">→</span>
                        </button>

                        <div className="login-info">
                            <div className="info-item">
                                <span className="info-icon">🔒</span>
                                <span>Secured by Mr. Silent Portal</span>
                            </div>
                            <div className="info-item">
                                <span className="info-icon">⚡</span>
                                <span>Google OAuth & Passkey</span>
                            </div>
                            <div className="info-item">
                                <span className="info-icon">🛡️</span>
                                <span>Device binding protection</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="features-section">
                    <div className="feature-card">
                        <div className="feature-icon">📱</div>
                        <h3>Order Nomor WA</h3>
                        <p>Order nomor WhatsApp dari Vietnam & Colombia</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">⏱️</div>
                        <h3>Auto OTP</h3>
                        <p>OTP diterima otomatis dalam hitungan detik</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🔄</div>
                        <h3>Bulk Order</h3>
                        <p>Order hingga 20 nomor sekaligus</p>
                    </div>
                </div>

                {/* Footer */}
                <footer className="landing-footer">
                    <p>© 2026 OTP Hero — Powered by Hero-SMS & Mr. Silent Portal</p>
                </footer>
            </div>
        </div>
    );
}
