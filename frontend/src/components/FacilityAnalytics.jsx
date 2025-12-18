import { useEffect, useState } from "react"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"
import EntryTimeChart from "./EntryTimeChart"

function FacilityAnalytics({ facility, setEditing }) {
  const [occupied, setOccupied] = useState(0)
  const [todayRevenue, setTodayRevenue] = useState(0)
  const [todayEntries, setTodayEntries] = useState([])

  useEffect(() => {
    const q = query(
      collection(db, "vehicles"),
      where("facilityId", "==", facility.id)
    )

    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      const today = new Date().toDateString()

      setOccupied(data.filter(v => v.status === "IN").length)

      setTodayRevenue(
        data
          .filter(v => v.exitTime && v.exitTime.toDate().toDateString() === today)
          .reduce((s, v) => s + (v.fee || 0), 0)
      )

      setTodayEntries(
        data.filter(v => v.entryTime?.toDate().toDateString() === today)
      )
    })

    return () => unsub()
  }, [facility.id])

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">{facility.name}</h2>
        <button className="dashboard-edit-btn" onClick={() => setEditing(true)}>Edit Facility</button>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card"><h4>Total Slots</h4><p>{facility.totalSlots}</p></div>
        <div className="dashboard-card"><h4>Occupied</h4><p>{occupied}</p></div>
        <div className="dashboard-card"><h4>Available</h4><p>{facility.totalSlots - occupied}</p></div>
        <div className="dashboard-card"><h4>Today's Revenue</h4><p>₹{todayRevenue}</p></div>
      </div>

      <h3 className="section-title">Today's Entries</h3>
      <div className="entry-list">
        {todayEntries.map(e => (
          <div className="entry-item" key={e.id}>
            {e.vehicleNumber} — {e.entryTime.toDate().toLocaleString()}
          </div>
        ))}
      </div>
      <h3 className="section-title">Peak Hours Chart</h3>
      <EntryTimeChart entries={todayEntries} />
    </div>
  )
}

export default FacilityAnalytics