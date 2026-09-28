import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios.js'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/interviews/dashboard/summary')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load dashboard'))
  }, [])

  if (error) return <p className="text-red-600 text-sm">{error}</p>
  if (!data) return <p className="text-ink/50 text-sm">Loading…</p>

  const { stats, recentInterviews } = data

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl font-semibold">Dashboard</h2>
        <Link to="/interviews/new" className="bg-teal text-paper text-sm font-medium px-4 py-2 rounded-sm hover:bg-teal-dark transition-colors">
          New interview
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-10">
        <Stat label="Total" value={stats.totalInterviews} />
        <Stat label="Completed" value={stats.completedInterviews} />
        <Stat label="In progress" value={stats.inProgressInterviews} />
        <Stat label="Avg. score" value={stats.averageScore} accent />
      </div>

      <h3 className="text-sm font-medium text-ink/60 uppercase tracking-wide mb-3">Recent interviews</h3>
      {recentInterviews.length === 0 ? (
        <p className="text-sm text-ink/50">No interviews yet — create your first one to get started.</p>
      ) : (
        <div className="border-t border-line">
          {recentInterviews.map((i) => (
            <Link
              key={i.id}
              to={i.status === 'comleted' ? `/interviews/${i.id}/results` : `/interviews/${i.id}`}
              className="flex items-center justify-between py-4 border-b border-line hover:bg-ink/[0.02] transition-colors"
            >
              <div>
                <p className="text-sm font-medium">{i.title}</p>
                <p className="text-xs text-ink/50">{i.company} · {i.role}</p>
              </div>
              <div className="flex items-center gap-4">
                <StatusPill status={i.status} />
                {i.score != null && <span className="font-serif text-lg">{i.score}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, accent }) {
  return (
    <div className="border border-line rounded-sm px-4 py-4">
      <p className="text-xs text-ink/50 mb-1">{label}</p>
      <p className={`font-serif text-3xl ${accent ? 'text-amber' : 'text-ink'}`}>{value ?? '—'}</p>
    </div>
  )
}

function StatusPill({ status }) {
  const map = {
    pending: 'bg-ink/10 text-ink/60',
    inprogress: 'bg-amber/15 text-amber',
    comleted: 'bg-teal/15 text-teal-dark',
  }
  const labelMap = { pending: 'Pending', inprogress: 'In progress', comleted: 'Completed' }
  return <span className={`text-xs px-2 py-1 rounded-sm ${map[status] || ''}`}>{labelMap[status] || status}</span>
}
