import { useEffect, useState } from "react"
import { collection, onSnapshot, query, where, updateDoc, doc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"
import Navbar from "../components/Navbar"
import { useFacility } from "../context/useFacility"
import { toast } from "react-toastify"

function ExitVehicle() {
  const { facility } = useFacility()
  const [vehicles, setVehicles] = useState([])

  useEffect(() => {
    if (!facility) return

    const q = query(
      collection(db, "vehicles"),
      where("facilityId", "==", facility.id),
      where("status", "==", "IN")
    )

    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setVehicles(data)
    })

    return () => unsub()
  }, [facility])

  const calculateFee = (hours) => {
    let fee = facility.rateFirstHour
    if (hours > 1) fee += (hours - 1) * facility.rateExtraHour
    return fee
  }

  const handleExit = async (v) => {
    const confirmExit = window.confirm(
      `Vehicle: ${v.vehicleNumber}\n` +
      `Entry Time: ${v.entryTime.toDate().toLocaleString()}\n\n` +
      `Confirm exit?`
    )
    if (!confirmExit) return

    const entry = v.entryTime.toDate()
    const now = new Date()
    const hours = Math.ceil((now - entry) / (1000 * 60 * 60))
    const fee = calculateFee(hours)

    await updateDoc(doc(db, "vehicles", v.id), {
      exitTime: serverTimestamp(),
      duration: hours,
      fee,
      status: "OUT"
    })

    toast.success(`Vehicle exited successfully!\nFee: ₹${fee}`, { autoClose: 4000 })
  }

  if (!facility) return null

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h2 className="page-title">Exit Vehicle</h2>

        <div className="vehicle-list">
          {vehicles.map(v => (
            <div className="vehicle-card" key={v.id}>
              <p className="vehicle-title">
                <strong>{v.vehicleNumber}</strong> ({v.vehicleType})
              </p>

              <p className="vehicle-info">
                Entry: {v.entryTime.toDate().toLocaleString()}
              </p>

              <button className="form-button exit-button" onClick={() => handleExit(v)}>
                Exit Vehicle
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default ExitVehicle
