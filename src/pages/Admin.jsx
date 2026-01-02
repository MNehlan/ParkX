import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"
import Navbar from "../components/Navbar"
import { useAdmin } from "../context/useAdmin"
import "../styles/admin.css"

function Admin() {
  const { isAdmin, loading: adminLoading } = useAdmin()
  const [facilities, setFacilities] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalFacilities: 0,
    totalVehicles: 0,
    activeVehicles: 0,
    totalRevenue: 0,
    totalUsers: 0
  })
  const [selectedFacility, setSelectedFacility] = useState(null)

  useEffect(() => {
    if (!isAdmin || adminLoading) return

    const loadData = async () => {
      try {
        // Load all facilities
        const facilitiesSnap = await getDocs(collection(db, "facilities"))
        const facilitiesData = facilitiesSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setFacilities(facilitiesData)

        // Load all vehicles
        const vehiclesSnap = await getDocs(collection(db, "vehicles"))
        const vehiclesData = vehiclesSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setVehicles(vehiclesData)

        // Calculate stats
        const activeVehicles = vehiclesData.filter(v => v.status === "IN").length
        const totalRevenue = vehiclesData
          .filter(v => v.fee)
          .reduce((sum, v) => sum + (v.fee || 0), 0)

        // Get unique user IDs from facilities
        const uniqueUsers = new Set(facilitiesData.map(f => f.ownerId))

        setStats({
          totalFacilities: facilitiesData.length,
          totalVehicles: vehiclesData.length,
          activeVehicles,
          totalRevenue,
          totalUsers: uniqueUsers.size
        })

        setLoading(false)
      } catch (error) {
        console.error("Error loading admin data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [isAdmin, adminLoading])

  if (adminLoading) {
    return (
      <>
        <Navbar adminView={true} />
        <p className="loading-text">Checking admin access...</p>
      </>
    )
  }

  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <div className="admin-error">
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
        </div>
      </>
    )
  }

  if (loading) {
    return (
      <>
        <Navbar adminView={true} />
        <p className="loading-text">Loading admin data...</p>
      </>
    )
  }

  const facilityVehicles = selectedFacility
    ? vehicles.filter(v => v.facilityId === selectedFacility.id)
    : []

  return (
    <>
      <Navbar adminView={true} />
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">Monitor all facilities and users</p>
        </div>

        {/* Stats Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="stat-icon">🏢</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalFacilities}</div>
              <div className="stat-label">Total Facilities</div>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-icon">🚗</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalVehicles}</div>
              <div className="stat-label">Total Vehicles</div>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-icon">🟢</div>
            <div className="stat-content">
              <div className="stat-value">{stats.activeVehicles}</div>
              <div className="stat-label">Active Now</div>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">₹{stats.totalRevenue.toLocaleString()}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>
        </div>

        {/* Facilities List */}
        <div className="admin-section">
          <h2 className="section-heading">All Facilities</h2>
          <div className="facilities-grid">
            {facilities.map(facility => (
              <div
                key={facility.id}
                className={`facility-card ${selectedFacility?.id === facility.id ? 'selected' : ''}`}
                onClick={() => setSelectedFacility(selectedFacility?.id === facility.id ? null : facility)}
              >
                <div className="facility-header">
                  <h3 className="facility-name">{facility.name}</h3>
                  <span className="facility-type">{facility.type}</span>
                </div>
                <div className="facility-details">
                  <div className="facility-detail-item">
                    <span className="detail-label">Slots:</span>
                    <span className="detail-value">{facility.totalSlots}</span>
                  </div>
                  <div className="facility-detail-item">
                    <span className="detail-label">Rate:</span>
                    <span className="detail-value">₹{facility.rateFirstHour}/hr</span>
                  </div>
                  <div className="facility-detail-item">
                    <span className="detail-label">Owner ID:</span>
                    <span className="detail-value small">{facility.ownerId?.substring(0, 8)}...</span>
                  </div>
                </div>
                <div className="facility-vehicles-count">
                  <div className="vehicle-count-main">
                    <strong>{vehicles.filter(v => v.facilityId === facility.id).length}</strong> total vehicles
                  </div>
                  <div className="vehicle-count-details">
                    <span className="count-item">
                      🟢 {vehicles.filter(v => v.facilityId === facility.id && v.status === "IN").length} parked
                    </span>
                    <span className="count-item">
                      ⚪ {vehicles.filter(v => v.facilityId === facility.id && v.status === "OUT").length} exited
                    </span>
                  </div>
                  {/* Vehicle type breakdown */}
                  {(() => {
                    const facilityVehicles = vehicles.filter(v => v.facilityId === facility.id)
                    const typeBreakdown = {}
                    facilityVehicles.forEach(v => {
                      const type = v.vehicleType || "Unknown"
                      typeBreakdown[type] = (typeBreakdown[type] || 0) + 1
                    })
                    return Object.keys(typeBreakdown).length > 0 ? (
                      <div className="vehicle-type-breakdown">
                        {Object.entries(typeBreakdown).map(([type, count]) => (
                          <span key={type} className="type-badge">
                            {type === "Car" ? "🚗" : type === "Bike" ? "🏍️" : type === "Truck" ? "🚚" : "🚙"} {type}: {count}
                          </span>
                        ))}
                      </div>
                    ) : null
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Facility Details */}
        {selectedFacility && (
          <div className="admin-section">
            <h2 className="section-heading">
              Vehicles at {selectedFacility.name}
              <button
                className="close-btn"
                onClick={() => setSelectedFacility(null)}
              >
                ✕
              </button>
            </h2>
            <div className="vehicles-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Vehicle Number</th>
                    <th>Type</th>
                    <th>Driver</th>
                    <th>Status</th>
                    <th>Entry Time</th>
                    <th>Exit Time</th>
                    <th>Duration</th>
                    <th>Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {facilityVehicles.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="no-data">No vehicles found</td>
                    </tr>
                  ) : (
                    facilityVehicles.map(vehicle => (
                      <tr key={vehicle.id}>
                        <td><strong>{vehicle.vehicleNumber}</strong></td>
                        <td>{vehicle.vehicleType}</td>
                        <td>{vehicle.driverName || "-"}</td>
                        <td>
                          <span className={`status-badge ${vehicle.status === "IN" ? "status-in" : "status-out"}`}>
                            {vehicle.status}
                          </span>
                        </td>
                        <td>
                          {vehicle.entryTime?.toDate
                            ? vehicle.entryTime.toDate().toLocaleString()
                            : "-"}
                        </td>
                        <td>
                          {vehicle.exitTime?.toDate
                            ? vehicle.exitTime.toDate().toLocaleString()
                            : "-"}
                        </td>
                        <td>{vehicle.duration ? `${vehicle.duration} hrs` : "-"}</td>
                        <td>{vehicle.fee ? `₹${vehicle.fee}` : "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* All Vehicles Summary */}
        <div className="admin-section">
          <h2 className="section-heading">Recent Vehicle Activity</h2>
          <div className="vehicles-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Vehicle Number</th>
                  <th>Facility</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Entry Time</th>
                  <th>Fee</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.slice(0, 20).map(vehicle => {
                  const facility = facilities.find(f => f.id === vehicle.facilityId)
                  return (
                    <tr key={vehicle.id}>
                      <td><strong>{vehicle.vehicleNumber}</strong></td>
                      <td>{facility?.name || "Unknown"}</td>
                      <td>{vehicle.vehicleType}</td>
                      <td>
                        <span className={`status-badge ${vehicle.status === "IN" ? "status-in" : "status-out"}`}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td>
                        {vehicle.entryTime?.toDate
                          ? vehicle.entryTime.toDate().toLocaleString()
                          : "-"}
                      </td>
                      <td>{vehicle.fee ? `₹${vehicle.fee}` : "-"}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default Admin
