import { useEffect, useState } from "react"
import { addDoc, collection, getDocs, onSnapshot, query, serverTimestamp, where } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"
import Navbar from "../components/Navbar"
import SlotGrid from "../components/SlotGrid"
import { useFacility } from "../context/useFacility"
import { toast } from "react-toastify"

function AddVehicle() {
  const { facility } = useFacility()

  const [vehicleNumber, setVehicleNumber] = useState("")
  const [vehicleType, setVehicleType] = useState("")
  const [driverName, setDriverName] = useState("")
  const [occupiedCount, setOccupiedCount] = useState(0)
  const [bookedSlots, setBookedSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)

  useEffect(() => {
    if (!facility) return

    const q = query(
      collection(db, "vehicles"),
      where("facilityId", "==", facility.id),
      where("status", "==", "IN")
    )

    const unsub = onSnapshot(q, snap => {
      setOccupiedCount(snap.size)
      // Extract slot numbers from documents
      const slots = snap.docs
        .map(doc => doc.data().slotNumber)
        .filter(slot => slot !== undefined && slot !== null)
      setBookedSlots(slots)
    })
    return () => unsub()
  }, [facility])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedSlot) {
      toast.error("Please select a parking slot!")
      return
    }

    // Convert vehicle number to uppercase
    const upperVehicleNumber = vehicleNumber.toUpperCase().trim()

    const duplicateCheck = query(
      collection(db, "vehicles"),
      where("facilityId", "==", facility.id),
      where("vehicleNumber", "==", upperVehicleNumber),
      where("status", "==", "IN")
    )

    const dupSnap = await getDocs(duplicateCheck)
    if (!dupSnap.empty) {
      toast.error("Vehicle already parked!")
      return
    }

    const entryTimestamp = new Date()

    await addDoc(collection(db, "vehicles"), {
      facilityId: facility.id,
      vehicleNumber: upperVehicleNumber,
      vehicleType,
      driverName,
      slotNumber: selectedSlot, // Save the selected slot
      entryTime: serverTimestamp(),
      status: "IN",
    })

    toast.success(
      `Vehicle Added!\nSlot: ${selectedSlot}\nVehicle No: ${upperVehicleNumber}\nDriver: ${driverName}\nEntry Time: ${entryTimestamp.toLocaleString()}`,
      { autoClose: 4000 }
    )

    setVehicleNumber("")
    setVehicleType("")
    setDriverName("")
    setSelectedSlot(null)
  }

  if (!facility) return null

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h2 className="page-title">Add Vehicle</h2>

        {/* Display occupied slots info */}
        <div className="card occupied-info">
          <p><strong>Current Occupied Slots:</strong> {occupiedCount}</p>
          <p><strong>Available Slots:</strong> {facility.totalSlots - occupiedCount}</p>
        </div>

        {/* Slot Grid Selection */}
        <div className="section-container">
          <h3>Select a Parking Slot</h3>
          <SlotGrid
            totalSlots={parseInt(facility.totalSlots)}
            bookedSlots={bookedSlots}
            onSlotSelect={setSelectedSlot}
            selectedSlot={selectedSlot}
          />
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className="form-input"
              placeholder="Vehicle Number (e.g., ABC1234)"
              value={vehicleNumber}
              onChange={e => setVehicleNumber(e.target.value.toUpperCase())}
              style={{ textTransform: "uppercase" }}
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

          {selectedSlot && (
            <div className="selected-slot-info" style={{ marginBottom: '1rem', color: 'var(--primary-light)', fontWeight: 'bold' }}>
              Selected Slot: {selectedSlot}
            </div>
          )}

          <button className="form-button" disabled={!selectedSlot}>
            {selectedSlot ? 'Add Vehicle' : 'Select a Slot'}
          </button>
        </form>
      </div>
    </>
  )
}

export default AddVehicle
