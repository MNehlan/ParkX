import { useState } from "react"
import { updateDoc, doc } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"

function FacilityEditForm({ facility, setFacility, setEditing }) {
  const [name, setName] = useState(facility.name)
  const [type, setType] = useState(facility.type)
  const [slots, setSlots] = useState(facility.totalSlots)
  const [firstHour, setFirstHour] = useState(facility.rateFirstHour)
  const [extraHour, setExtraHour] = useState(facility.rateExtraHour)

  const handleUpdate = async (e) => {
    e.preventDefault()

    const ref = doc(db, "facilities", facility.id)

    await updateDoc(ref, {
      name,
      type,
      totalSlots: Number(slots),
      rateFirstHour: Number(firstHour),
      rateExtraHour: Number(extraHour)
    })

    setFacility({
      ...facility,
      name,
      type,
      totalSlots: Number(slots),
      rateFirstHour: Number(firstHour),
      rateExtraHour: Number(extraHour)
    })

    setEditing(false)
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Edit Facility Details</h2>

      <form className="form" onSubmit={handleUpdate}>
        <input className="form-input" value={name} onChange={e => setName(e.target.value)} />

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

        <input className="form-input" type="number" value={slots} onChange={e => setSlots(e.target.value)} />

        <input className="form-input" type="number" value={firstHour} onChange={e => setFirstHour(e.target.value)} />

        <input className="form-input" type="number" value={extraHour} onChange={e => setExtraHour(e.target.value)} />

        <div className="form-actions">
          <button className="form-button">Update</button>
          <button className="form-button cancel-btn" type="button" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default FacilityEditForm