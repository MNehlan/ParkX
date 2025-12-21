import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext)
  if (!user) return <Navigate to="/" />
  return children
}
