import { useEffect, useState } from "react"
import { addDoc, collection, getDocs, onSnapshot, query, serverTimestamp, where } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"
import Navbar from "../components/Navbar"
import { useFacility } from "../context/useFacility"

function AddVehicle() {
  const { facility } = useFacility()

  const [vehicleNumber, setVehicleNumber] = useState("")
  const [vehicleType, setVehicleType] = useState("")
  const [driverName, setDriverName] = useState("")
  const [occupied, setOccupied] = useState(0)

  useEffect(() => {
    if (!facility) return

    const q = query(
      collection(db, "vehicles"),
      where("facilityId", "==", facility.id),
      where("status", "==", "IN")
    )

    const unsub = onSnapshot(q, snap => setOccupied(snap.size))
    return () => unsub()
  }, [facility])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const duplicateCheck = query(
      collection(db, "vehicles"),
      where("facilityId", "==", facility.id),
      where("vehicleNumber", "==", vehicleNumber),
      where("status", "==", "IN")
    )

    const dupSnap = await getDocs(duplicateCheck)
    if (!dupSnap.empty) return alert("Vehicle already parked!")

    const entryTimestamp = new Date()

    await addDoc(collection(db, "vehicles"), {
      facilityId: facility.id,
      vehicleNumber,
      vehicleType,
      driverName,
      entryTime: serverTimestamp(),
      status: "IN",
    })

    alert(
      `Vehicle Added!\n` +
      `Vehicle No: ${vehicleNumber}\n` +
      `Driver: ${driverName}\n` +
      `Entry Time: ${entryTimestamp.toLocaleString()}`
    )

    setVehicleNumber("")
    setVehicleType("")
    setDriverName("")
  }

  if (!facility) return null

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h2 className="page-title">Add Vehicle</h2>

        {/* Display occupied slots info */}
        <div className="card occupied-info">
          <p><strong>Current Occupied Slots:</strong> {occupied}</p>
          <p><strong>Available Slots:</strong> {facility.totalSlots - occupied}</p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className="form-input"
              placeholder="Vehicle Number"
              value={vehicleNumber}
              onChange={e => setVehicleNumber(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <select
              className="form-select"
              value={vehicleType}
              onChange={e => setVehicleType(e.target.value)}
              required
            >
              <option value="">Select Vehicle Type</option>
              <option>Car</option>
              <option>Bike</option>
              <option>Truck</option>
            </select>
          </div>

          <div className="form-group">
            <input
              className="form-input"
              placeholder="Driver Name"
              value={driverName}
              onChange={e => setDriverName(e.target.value)}
              required
            />
          </div>

          <button className="form-button">Add Vehicle</button>
        </form>
      </div>
    </>
  )
}

export default AddVehicle
