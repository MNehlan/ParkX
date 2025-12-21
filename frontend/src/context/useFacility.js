import { useEffect, useState, useContext } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"
import { AuthContext } from "./AuthContext"

export function useFacility() {
  const { user } = useContext(AuthContext)
  const [facility, setFacility] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchFacility = async () => {
      const q = query(
        collection(db, "facilities"),
        where("ownerId", "==", user.uid)
      )

      const snap = await getDocs(q)

      if (!snap.empty) {
        setFacility({ id: snap.docs[0].id, ...snap.docs[0].data() })
      }

      setLoading(false)
    }

    fetchFacility()
  }, [user])

  return { facility, loading }
}
