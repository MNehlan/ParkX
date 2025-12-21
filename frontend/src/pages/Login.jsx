import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { db, auth } from "../firebase/firebaseConfig"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import "../styles/auth.css"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Check if user is admin
      const adminDoc = await getDoc(doc(db, "admins", user.uid))

      if (adminDoc.exists()) {
        navigate("/admin")
      } else {
        navigate("/dashboard")
      }
    } catch (err) {
      toast.error("Invalid login credentials: " + err.message)
    }
  }

  return (
    <div className="auth-container">
      <h2 className="auth-title">Parking Facility Login</h2>

      <form className="auth-form" onSubmit={handleLogin}>
        <input
          className="auth-input"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="password-input-wrapper">
          <input
            className="auth-input"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <button className="auth-button">Login</button>
      </form>

      <p className="auth-switch">
        New facility?{" "}
        <span className="auth-link" onClick={() => navigate("/signup")}>
          Register here
        </span>
      </p>
      <p className="auth-switch">
        <span className="auth-link" onClick={() => navigate("/")}>
          ← Back to Home
        </span>
      </p>
    </div>
  )
}

export default Login
