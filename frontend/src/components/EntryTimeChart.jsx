import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import "../styles/charts.css"

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
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={hourly} className="chart">
          <XAxis
            dataKey="hour"
            stroke="#cbd5e1"
            tick={{ fill: '#cbd5e1' }}
            style={{ fontSize: '0.85rem' }}
          />
          <YAxis
            stroke="#cbd5e1"
            tick={{ fill: '#cbd5e1' }}
            style={{ fontSize: '0.85rem' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f1f5f9'
            }}
            labelStyle={{ color: '#cbd5e1' }}
          />
          <Bar
            dataKey="count"
            fill="#6366f1"
            radius={[8, 8, 0, 0]}
            className="chart-bar"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default EntryTimeChart