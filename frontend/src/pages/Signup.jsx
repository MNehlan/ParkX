import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase/firebaseConfig"
import { useNavigate } from "react-router-dom"
import "../styles/auth.css"

function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()

    await createUserWithEmailAndPassword(auth, email, password)

    navigate("/dashboard")
  }

  return (
    <div className="auth-container">
      <h2 className="auth-title">Create Your Account</h2>

      <form className="auth-form" onSubmit={handleSignup}>
        <input
          className="auth-input"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button className="auth-button">Create Account</button>
        <p className="auth-link" onClick={() => navigate("/")}>
          Already have an account? Log in
        </p>
      </form>
    </div>
  )
}

export default Signup
