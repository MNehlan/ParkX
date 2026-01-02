import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../firebase/firebaseConfig"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import "../styles/auth.css"

import { toast } from "react-toastify"

function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: serverTimestamp(),
        role: "user" // Default role
      })

      navigate("/dashboard")
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error("Email is already registered. Please log in.")
      } else {
        toast.error("Signup failed: " + error.message)
      }
    }
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

        <div className="password-input-wrapper">
          <input
            className="auth-input"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
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

        <button className="auth-button">Create Account</button>
        <p className="auth-switch">
          Already have an account?{" "}
          <span className="auth-link" onClick={() => navigate("/login")}>
            Log in
          </span>
        </p>
        <p className="auth-switch">
          <span className="auth-link" onClick={() => navigate("/")}>
            ← Back to Home
          </span>
        </p>
      </form>
    </div>
  )
}

export default Signup
