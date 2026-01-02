import { useEffect, useState } from "react"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"
import EntryTimeChart from "./EntryTimeChart"
import SlotGrid from "./SlotGrid"
import "../styles/analytics.css"

function FacilityAnalytics({ facility, setEditing }) {
  const [occupied, setOccupied] = useState(0)
  const [todayRevenue, setTodayRevenue] = useState(0)
  const [todayEntries, setTodayEntries] = useState([])
  const [vehicleTypeStats, setVehicleTypeStats] = useState({})

  const [bookedSlots, setBookedSlots] = useState([])

  useEffect(() => {
    const q = query(
      collection(db, "vehicles"),
      where("facilityId", "==", facility.id)
    )

    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      const today = new Date().toDateString()


      const activeVehicles = data.filter(v => v.status === "IN")
      setOccupied(activeVehicles.length)

      // Extract slot numbers
      const slots = activeVehicles
        .map(v => v.slotNumber)
        .filter(slot => slot !== undefined && slot !== null)
      setBookedSlots(slots)

      setTodayRevenue(
        data
          .filter(v => v.exitTime && v.exitTime.toDate().toDateString() === today)
          .reduce((s, v) => s + (v.fee || 0), 0)
      )

      setTodayEntries(
        data.filter(v => v.entryTime?.toDate().toDateString() === today)
      )

      // Calculate vehicle type statistics
      const typeStats = {}
      data.forEach(vehicle => {
        const type = vehicle.vehicleType || "Unknown"
        if (!typeStats[type]) {
          typeStats[type] = { total: 0, parked: 0 }
        }
        typeStats[type].total++
        if (vehicle.status === "IN") {
          typeStats[type].parked++
        }
      })
      setVehicleTypeStats(typeStats)
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
        <div className="dashboard-card">
          <div className="card-icon">🅿️</div>
          <h4>Total Slots</h4>
          <p>{facility.totalSlots}</p>
        </div>
        <div className="dashboard-card occupied-card">
          <div className="card-icon">🚗</div>
          <h4>Occupied</h4>
          <p>{occupied}</p>
          <div className="card-progress">
            <div
              className="progress-bar"
              style={{ width: `${(occupied / facility.totalSlots) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="dashboard-card available-card">
          <div className="card-icon">✅</div>
          <h4>Available</h4>
          <p>{facility.totalSlots - occupied}</p>
          <div className="card-progress">
            <div
              className="progress-bar available-progress"
              style={{ width: `${((facility.totalSlots - occupied) / facility.totalSlots) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="dashboard-card revenue-card">
          <div className="card-icon">💰</div>
          <h4>Today's Revenue</h4>
          <p>₹{todayRevenue.toLocaleString()}</p>
        </div>
      </div>


      <div className="section-container" style={{ marginTop: '2rem' }}>
        <h3 className="section-title">Available Slots</h3>
        <SlotGrid
          totalSlots={parseInt(facility.totalSlots)}
          bookedSlots={bookedSlots}
        />
      </div>

      <h3 className="section-title">Today's Entries</h3>
      {
        todayEntries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No entries today</p>
          </div>
        ) : (
          <div className="entry-list">
            {todayEntries.map(e => (
              <div className="entry-item" key={e.id}>
                <div className="entry-content">
                  <div className="entry-vehicle">
                    <span className="vehicle-icon">🚙</span>
                    <strong>{e.vehicleNumber}</strong>
                  </div>
                  <div className="entry-details">
                    <span className="driver-name">{e.driverName || "Unknown Driver"}</span>
                    <span className="entry-time-text">
                      {e.entryTime?.toDate ? e.entryTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      }
      <h3 className="section-title">Vehicle Type Statistics</h3>
      <div className="vehicle-type-grid">
        {Object.keys(vehicleTypeStats).length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🚗</div>
            <p>No vehicles tracked yet</p>
          </div>
        ) : (
          Object.entries(vehicleTypeStats).map(([type, stats]) => (
            <div key={type} className="vehicle-type-card">
              <div className="vehicle-type-header">
                <span className="vehicle-type-icon">
                  {type === "Car" ? "🚗" : type === "Bike" ? "🏍️" : type === "Truck" ? "🚚" : "🚙"}
                </span>
                <h4>{type}</h4>
              </div>
              <div className="vehicle-type-stats">
                <div className="stat-row">
                  <span className="stat-label">Total:</span>
                  <span className="stat-value">{stats.total}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Currently Parked:</span>
                  <span className="stat-value parked">{stats.parked}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Available:</span>
                  <span className="stat-value available">{stats.total - stats.parked}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <h3 className="section-title">Peak Hours Chart</h3>
      <EntryTimeChart entries={todayEntries} />
    </div >
  )
}

export default FacilityAnalytics