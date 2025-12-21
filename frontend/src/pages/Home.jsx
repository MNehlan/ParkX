import { useNavigate } from "react-router-dom"
import "../styles/home.css"

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      {/* Simple Navigation */}
      <nav className="home-nav">
        <div className="home-nav-content">
          <h2 className="home-nav-logo">Vehicle Parking System</h2>
          <div className="home-nav-links">
            <button className="home-nav-btn" onClick={() => navigate("/login")}>
              Sign In
            </button>
            <button className="home-nav-btn primary" onClick={() => navigate("/signup")}>
              Get Started
            </button>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Smart Parking Management
            <span className="gradient-text"> Made Simple</span>
          </h1>
          <p className="hero-description">
            Streamline your parking facility operations with our comprehensive management system.
            Track vehicles, manage slots, analyze revenue, and optimize your parking space efficiently.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate("/signup")}>
              Get Started
            </button>
            <button className="btn-secondary" onClick={() => navigate("/login")}>
              Sign In
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="parking-visual">
            <div className="parking-lot">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`parking-slot ${i % 3 === 0 ? 'occupied' : ''}`}>
                  <div className="slot-number">{i + 1}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Our Platform?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚗</div>
            <h3>Vehicle Tracking</h3>
            <p>Real-time tracking of all vehicles entering and exiting your facility</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics Dashboard</h3>
            <p>Comprehensive analytics and insights to optimize your operations</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Revenue Management</h3>
            <p>Track daily revenue and generate detailed financial reports</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>Peak Hours Analysis</h3>
            <p>Identify peak hours and optimize staffing and pricing strategies</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Easy to Use</h3>
            <p>Intuitive interface designed for quick and efficient operations</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Reliable</h3>
            <p>Enterprise-grade security with cloud-based reliability</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">100+</div>
            <div className="stat-label">Facilities</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Vehicles Tracked</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">99.9%</div>
            <div className="stat-label">Uptime</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Parking Management?</h2>
          <p className="cta-description">
            Join hundreds of facilities already using our platform to streamline operations
          </p>
          <button className="btn-primary btn-large" onClick={() => navigate("/signup")}>
            Get Started Free
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home

