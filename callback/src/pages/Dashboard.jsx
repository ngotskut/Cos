import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
    const { user, logout, authMessage } = useAuth();

    const botUsername = "OTPHeroRobot"; // Replace with actual bot username

    return (
        <div className="dashboard-page">
            {/* Background effects */}
            <div className="bg-particles">
                <div className="particle particle-1" />
                <div className="particle particle-2" />
                <div className="particle particle-3" />
            </div>

            {/* Navbar */}
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <span className="nav-icon">🤖</span>
                    <span className="nav-title">OTP Hero</span>
                </div>
                <div className="nav-actions">
                    <span className="nav-user">
                        <span className="user-avatar">
                            {user?.email?.[0]?.toUpperCase() || "U"}
                        </span>
                        <span className="user-email">{user?.email || "User"}</span>
                    </span>
                    <button id="logout-button" className="logout-btn" onClick={logout}>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="dashboard-main">
                {authMessage && (
                    <div className="auth-notification">
                        <span>{authMessage}</span>
                    </div>
                )}

                {/* Welcome Card */}
                <div className="welcome-card">
                    <div className="welcome-header">
                        <div className="welcome-icon">👋</div>
                        <div>
                            <h1>Selamat Datang!</h1>
                            <p className="welcome-email">{user?.email}</p>
                        </div>
                    </div>

                    <div className="status-badges">
                        <div className="status-badge active">
                            <span className="badge-dot" />
                            <span>Terautentikasi</span>
                        </div>
                        {user?.whitelisted && (
                            <div className="status-badge whitelisted">
                                <span className="badge-dot" />
                                <span>Whitelisted</span>
                            </div>
                        )}
                        {user?.membership && (
                            <div className="status-badge membership">
                                <span className="badge-dot" />
                                <span>{user.membership.plan || "Member"}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Cards */}
                <div className="action-cards">
                    {/* Go to Bot */}
                    <a
                        href={`https://t.me/${botUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-card primary"
                        id="goto-bot"
                    >
                        <div className="action-icon">🤖</div>
                        <div className="action-content">
                            <h3>Buka Bot Telegram</h3>
                            <p>Kembali ke bot OTP Hero untuk mulai order nomor WA</p>
                        </div>
                        <span className="action-arrow">→</span>
                    </a>

                    {/* Account Info */}
                    <div className="action-card info">
                        <div className="action-icon">📋</div>
                        <div className="action-content">
                            <h3>Info Akun</h3>
                            <div className="info-grid">
                                <div className="info-row">
                                    <span className="info-label">Email</span>
                                    <span className="info-value">{user?.email}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">App</span>
                                    <span className="info-value">{user?.app_name || "OTP Hero"}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Auth Method</span>
                                    <span className="info-value">{user?.auth_method || "—"}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Status</span>
                                    <span className="info-value status-active">
                                        Aktif ✅
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Help */}
                    <div className="action-card help">
                        <div className="action-icon">💡</div>
                        <div className="action-content">
                            <h3>Cara Menggunakan</h3>
                            <ol className="help-steps">
                                <li>Login di portal ini ✅ (sudah selesai)</li>
                                <li>Buka bot Telegram @{botUsername}</li>
                                <li>Ketik <code>/start</code> di bot</li>
                                <li>Set API Key Hero-SMS dengan <code>/setapi</code></li>
                                <li>Pilih negara & jumlah nomor, lalu order!</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
