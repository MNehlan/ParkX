import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

function EntryTimeChart({ entries }) {
  const hourly = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: 0
  }))

  entries.forEach(e => {
    const h = e.entryTime?.toDate().getHours()
    if (h !== undefined) hourly[h].count++
  })

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={hourly} className="chart">
          <XAxis dataKey="hour" className="chart-axis" />
          <YAxis className="chart-axis" />
          <Tooltip className="chart-tooltip" />
          <Bar dataKey="count" fill="#4a90e2" className="chart-bar" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default EntryTimeChart