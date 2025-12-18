import { useState, useEffect } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"
import Navbar from "../components/Navbar"
import { useAuth } from "../context/useAuth"

// IMPORT SUB COMPONENTS
import FacilitySetupForm from "../components/FacilitySetupForm"
import FacilityEditForm from "../components/FacilityEditForm"
import FacilityAnalytics from "../components/FacilityAnalytics"

function Dashboard() {
  const { user } = useAuth()

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
