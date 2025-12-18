import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase/firebaseConfig"
import { useNavigate } from "react-router-dom"
import "../styles/auth.css"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/dashboard")
    } catch (err) {
      alert("Invalid login credentials", err.message)
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

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="auth-button">Login</button>
      </form>

      <p className="auth-switch">
        New facility?{" "}
        <span className="auth-link" onClick={() => navigate("/signup")}>
          Register here
        </span>
      </p>
    </div>
  )
}

export default Login
