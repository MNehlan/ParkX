import { useState } from "react"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"
import { useAuth } from "../context/useAuth"

function FacilitySetupForm({ setFacility }) {
  const { user } = useAuth()

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

        <input className="form-input" placeholder="Facility Type" onChange={e => setType(e.target.value)} required />

        <input className="form-input" type="number" placeholder="Total Slots" onChange={e => setSlots(e.target.value)} required />

        <input className="form-input" type="number" placeholder="First Hour Charge" onChange={e => setFirstHour(e.target.value)} required />

        <input className="form-input" type="number" placeholder="Extra Hour Charge" onChange={e => setExtraHour(e.target.value)} required />

        <button className="form-button">Save Facility</button>
      </form>
    </div>
  )
}

export default FacilitySetupForm
