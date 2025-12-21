import { useState, useContext } from "react"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"
import { AuthContext } from "../context/AuthContext"

function FacilitySetupForm({ setFacility }) {
  const { user } = useContext(AuthContext)

  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [slots, setSlots] = useState("")
  const [firstHour, setFirstHour] = useState("")
  const [extraHour, setExtraHour] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    const docRef = await addDoc(collection(db, "facilities"), {
      ownerId: user.uid,
      name,
      type,
      totalSlots: Number(slots),
      rateFirstHour: Number(firstHour),
      rateExtraHour: Number(extraHour),
      createdAt: serverTimestamp()
    })

    setFacility({
      id: docRef.id,
      name,
      type,
      totalSlots: Number(slots),
      rateFirstHour: Number(firstHour),
      rateExtraHour: Number(extraHour),
    })
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Setup Your Parking Facility</h2>

      <form className="form" onSubmit={handleSubmit}>
        <input className="form-input" placeholder="Facility Name" onChange={e => setName(e.target.value)} required />

        <select
          className="form-select"
          value={type}
          onChange={e => setType(e.target.value)}
          required
        >
          <option value="">Select Facility Type</option>
          <option value="Shopping Mall">Shopping Mall</option>
          <option value="Office Building">Office Building</option>
          <option value="Residential Complex">Residential Complex</option>
          <option value="Hospital">Hospital</option>
          <option value="Airport">Airport</option>
          <option value="Hotel">Hotel</option>
          <option value="Restaurant">Restaurant</option>
          <option value="Stadium">Stadium</option>
          <option value="Public Parking">Public Parking</option>
          <option value="Other">Other</option>
        </select>

        <input className="form-input" type="number" placeholder="Total Slots" onChange={e => setSlots(e.target.value)} required />

        <input className="form-input" type="number" placeholder="First Hour Charge" onChange={e => setFirstHour(e.target.value)} required />

        <input className="form-input" type="number" placeholder="Extra Hour Charge" onChange={e => setExtraHour(e.target.value)} required />

        <button className="form-button">Save Facility</button>
      </form>
    </div>
  )
}

export default FacilitySetupForm
