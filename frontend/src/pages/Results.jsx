import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios.js'

export default function Results() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/interviews/${id}/results`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load results'))
  }, [id])

  if (error) return <p className="text-red-600 text-sm">{error}</p>
  if (!data) return <p className="text-ink/50 text-sm">Loading…</p>

  const { interview, questions } = data

  return (
    <div className="max-w-2xl">
      <Link to="/" className="text-xs text-ink/50 hover:text-ink underline underline-offset-2">← Back to dashboard</Link>
      <div className="flex items-end justify-between mt-4 mb-8">
        <div>
          <h2 className="font-serif text-2xl font-semibold">{interview.title}</h2>
          <p className="text-sm text-ink/60">{interview.company} · {interview.role}</p>
        </div>
        <p className="font-serif text-4xl text-amber">{interview.score}<span className="text-lg text-ink/40">/10</span></p>
      </div>

      <div className="border border-line rounded-sm p-4 mb-8 bg-ink/[0.02]">
        <p className="text-sm text-ink/80 leading-relaxed">{interview.feedback}</p>
      </div>

      <h3 className="text-sm font-medium text-ink/60 uppercase tracking-wide mb-3">Question breakdown</h3>
      <div className="flex flex-col gap-4">
        {questions.map((q) => (
          <div key={q._id} className="border-t border-line pt-4">
            <div className="flex items-start justify-between gap-4 mb-2">
              <p className="text-sm font-medium">{q.order}. {q.questionText}</p>
              <span className="font-serif text-lg shrink-0">{q.score}/10</span>
            </div>
            <p className="text-xs text-ink/50 mb-2">Your answer: {q.answer}</p>
            <p className="text-sm text-ink/70">{q.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
