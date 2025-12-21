import { useEffect, useState, useMemo } from "react"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"
import Navbar from "../components/Navbar"
import { useFacility } from "../context/useFacility"
import { toast } from "react-toastify"
import "../styles/form.css"

function History() {
  const { facility } = useFacility()

  const [records, setRecords] = useState([])
  const [filterType, setFilterType] = useState("today")
  const [customStart, setCustomStart] = useState("")
  const [customEnd, setCustomEnd] = useState("")

  const toDate = (ts) => (ts?.toDate ? ts.toDate() : null)

  useEffect(() => {
    if (!facility) return

    const q = query(
      collection(db, "vehicles"),
      where("facilityId", "==", facility.id)
    )

    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setRecords(data)
    })

    return () => unsub()
  }, [facility])

  const filtered = useMemo(() => {
    if (records.length === 0) return []

    const today = new Date()
    let start, end

    switch (filterType) {
      case "today":
        start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        end = new Date(start)
        end.setDate(end.getDate() + 1)
        break

      case "week":
        start = new Date()
        start.setDate(today.getDate() - 7)
        end = today
        break

      case "month":
        start = new Date(today.getFullYear(), today.getMonth(), 1)
        end = new Date(today.getFullYear(), today.getMonth() + 1, 1)
        break

      case "all":
        return records.filter(r => r.exitTime)

      case "custom":
        if (!customStart || !customEnd) return []
        start = new Date(customStart)
        end = new Date(customEnd)
        end.setDate(end.getDate() + 1)
        break

      default:
        return []
    }

    return records.filter(r => {
      if (!r.exitTime) return false
      const exit = toDate(r.exitTime)
      return exit >= start && exit < end
    })
  }, [filterType, customStart, customEnd, records])

  const totalVehicles = filtered.length
  const totalRevenue = filtered.reduce((sum, r) => sum + (r.fee || 0), 0)
  const avgDuration = filtered.length
    ? (filtered.reduce((s, r) => s + (r.duration || 0), 0) / filtered.length).toFixed(1)
    : 0

  const downloadCSV = () => {
    if (filtered.length === 0) {
      toast.warning("No data to export")
      return
    }

    const headers = ["Vehicle", "Type", "Duration", "Fee", "Entry Time", "Exit Time"]
    const rows = filtered.map(r => [
      r.vehicleNumber,
      r.vehicleType,
      r.duration || "",
      r.fee || "",
      toDate(r.entryTime)?.toLocaleString() || "",
      toDate(r.exitTime)?.toLocaleString() || ""
    ])

    let csv = headers.join(",") + "\n"
    rows.forEach(row => (csv += row.join(",") + "\n"))

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "parking-history.csv"
    a.click()
  }

  if (!facility) return null

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h2 className="page-title">Parking History</h2>

        <div className="filter-section">
          <select
            className="form-select history-filter"
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
            <option value="custom">Custom Range</option>
          </select>

          {filterType === "custom" && (
            <div className="custom-range">
              <input className="form-input" type="date" onChange={e => setCustomStart(e.target.value)} />
              <input className="form-input" type="date" onChange={e => setCustomEnd(e.target.value)} />
            </div>
          )}
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card"><h4>Total Vehicles</h4><p>{totalVehicles}</p></div>
          <div className="dashboard-card"><h4>Total Revenue</h4><p>₹{totalRevenue}</p></div>
          <div className="dashboard-card"><h4>Avg Duration</h4><p>{avgDuration} hrs</p></div>
        </div>

        <button className="form-button download-btn" onClick={downloadCSV}>
          Download CSV
        </button>

        <table className="history-table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Type</th>
              <th>Duration</th>
              <th>Fee</th>
              <th>Entry Time</th>
              <th>Exit Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td>{r.vehicleNumber}</td>
                <td>{r.vehicleType}</td>
                <td>{r.duration || "-"}</td>
                <td>{r.fee ? `₹${r.fee}` : "-"}</td>
                <td>{toDate(r.entryTime)?.toLocaleString() || "-"}</td>
                <td>{toDate(r.exitTime)?.toLocaleString() || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </>
  )
}

export default History
