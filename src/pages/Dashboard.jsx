import { useState, useEffect, useContext } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"
import Navbar from "../components/Navbar"
import { AuthContext } from "../context/AuthContext"
import { useAdmin } from "../context/useAdmin"
import { Navigate } from "react-router-dom"

// IMPORT SUB COMPONENTS
import FacilitySetupForm from "../components/FacilitySetupForm"
import FacilityEditForm from "../components/FacilityEditForm"
import FacilityAnalytics from "../components/FacilityAnalytics"

function Dashboard() {
  const { user } = useContext(AuthContext)
  const { isAdmin, loading: adminLoading } = useAdmin()

  const [facility, setFacility] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    const loadFacility = async () => {
      const q = query(
        collection(db, "facilities"),
        where("ownerId", "==", user.uid)
      )

      const snap = await getDocs(q)

      if (!snap.empty) {
        setFacility({
          id: snap.docs[0].id,
          ...snap.docs[0].data()
        })
      }

      setLoading(false)
    }

    loadFacility()
  }, [user])

  if (loading) return <p className="loading-text">Loading...</p>

  if (!adminLoading && isAdmin) {
    return <Navigate to="/admin" />
  }

  return (
    <>
      <Navbar />

      <div className="dashboard-wrapper">
        {/* First-time facility setup */}
        {!facility ? (
          <FacilitySetupForm setFacility={setFacility} />
        ) : (
          <>
            {editing ? (
              <FacilityEditForm
                facility={facility}
                setFacility={setFacility}
                setEditing={setEditing}
              />
            ) : (
              <FacilityAnalytics
                facility={facility}
                setEditing={setEditing}
              />
            )}
          </>
        )}
      </div>
    </>
  )
}

export default Dashboard
