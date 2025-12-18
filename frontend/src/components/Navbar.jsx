import { signOut } from "firebase/auth"
import { auth } from "../firebase/firebaseConfig"
import { useNavigate, Link } from "react-router-dom"
import "../styles/dashboard.css"

function Navbar() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?\nYou will need to log in again to access your dashboard."
    )

    if (!confirmLogout) return

    await signOut(auth)
    navigate("/")
  }

  return (
    <nav className="navbar">
      <h3 className="nav-logo">Vehicle Parking System</h3>

      <div className="nav-links">
        <Link className="nav-link" to="/dashboard">Dashboard</Link>
        <Link className="nav-link" to="/add">Add Vehicle</Link>
        <Link className="nav-link" to="/exit">Exit Vehicle</Link>
        <Link className="nav-link" to="/history">History</Link>

        <button className="nav-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
