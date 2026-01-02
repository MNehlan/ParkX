import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"
import "../styles/home.css"
import carInside from "../assets/carinsideimage.jpg"
import insideParking from "../assets/inside.jpg"
import emptyGarage from "../assets/emptygarage.jpg"

function Home() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalFacilities: 0,
    totalSlots: 0,
    typeBreakdown: {}
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "facilities"))
        let totalSlots = 0
        const typeBreakdown = {}

        querySnapshot.forEach((doc) => {
          const data = doc.data()
          totalSlots += Number(data.totalSlots || 0)

          const type = data.type || "Other"
          typeBreakdown[type] = (typeBreakdown[type] || 0) + 1
        })

        setStats({
          totalFacilities: querySnapshot.size,
          totalSlots,
          typeBreakdown
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

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
        <div className="hero-image-container">
          <div className="hero-image-grid">
            <img src={carInside} alt="Modern Interior Parking" className="hero-img main" />
            <div className="hero-img-col">
              <img src={insideParking} alt="Indoor Parking Structure" className="hero-img sub" />
              <img src={emptyGarage} alt="Clean Empty Garage" className="hero-img sub" />
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
            <div className="stat-number">{loading ? "..." : stats.totalFacilities}</div>
            <div className="stat-label">Facilities Managed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{loading ? "..." : stats.totalSlots.toLocaleString()}</div>
            <div className="stat-label">Total Parking Slots</div>
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

        {!loading && Object.keys(stats.typeBreakdown).length > 0 && (
          <div className="type-stats-container">
            <h3 className="type-stats-title">Trusted by Various Industries</h3>
            <div className="type-grid">
              {Object.entries(stats.typeBreakdown).map(([type, count]) => (
                <div key={type} className="type-card">
                  <div className="type-count">{count}</div>
                  <div className="type-label">{type}</div>
                </div>
              ))}
            </div>
          </div>
        )}
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

