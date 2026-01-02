import { signOut } from "firebase/auth"
import { auth } from "../firebase/firebaseConfig"
import { useNavigate, Link } from "react-router-dom"
import { useAdmin } from "../context/useAdmin"
import { useState } from "react"
import ConfirmModal from "./ConfirmModal"
import "../styles/navbar.css"
import "../styles/dashboard.css"


function Navbar({ adminView }) {
  const navigate = useNavigate()
  const { isAdmin } = useAdmin()

  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = async () => {
    await signOut(auth)
    navigate("/")
  }

  return (
    <>
      <nav className="navbar">
        <Link to={adminView ? "/admin" : "/dashboard"} className="nav-logo-link">
          <h3 className="nav-logo">Vehicle Parking System</h3>
        </Link>

        <div className="nav-links">
          <Link className="nav-link" to={adminView ? "/admin" : "/dashboard"}>Dashboard</Link>
          {!adminView && (
            <>
              <Link className="nav-link" to="/add">Add Vehicle</Link>
              <Link className="nav-link" to="/exit">Exit Vehicle</Link>
            </>
          )}
          <Link className="nav-link" to={adminView ? "/admin/history" : "/history"}>History</Link>
          {adminView && (
            <Link className="nav-link" to="/admin/facilities">Facilities</Link>
          )}
          {isAdmin && !adminView && (
            <Link className="nav-link admin-link" to="/admin">
              Admin
            </Link>
          )}

          <button className="nav-logout" onClick={() => setShowLogoutModal(true)}>
            Logout
          </button>
        </div>
      </nav>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        message="Are you sure you want to logout? You will need to log in again to access your dashboard."
        confirmText="Logout"
      />
    </>
  )
}

export default Navbar
