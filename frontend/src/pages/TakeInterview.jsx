import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios.js'

export default function TakeInterview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [question, setQuestion] = useState(null)
  const [total, setTotal] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadCurrent = async () => {
    const { data } = await api.post(`/interviews/${id}/start`)
    setQuestion(data.currentQuestion)
    setTotal(data.totalQuestions)
    setAnswered(data.answeredCount)
  }

  useEffect(() => { loadCurrent() }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!answer.trim()) return
    setSubmitting(true)
    setError('')
    try {
      const { data } = await api.post(`/interviews/questions/${question._id}/answer`, { answer })
      setFeedback(data.evaluation)
      if (data.interviewCompleted) {
        setTimeout(() => navigate(`/interviews/${id}/results`), 1200)
      } else {
        setTimeout(() => {
          setQuestion(data.nextQuestion)
          setAnswered((a) => a + 1)
          setAnswer('')
          setFeedback(null)
        }, 1200)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit answer')
    } finally {
      setSubmitting(false)
    }
  }

  if (error) return <p className="text-red-600 text-sm">{error}</p>
  if (!question) return <p className="text-ink/50 text-sm">Loading…</p>

  return (
    <div className="max-w-2xl">
      <p className="text-xs text-ink/50 mb-2">Question {answered + 1} of {total}</p>
      <h2 className="font-serif text-xl font-semibold mb-6 leading-snug">{question.questionText}</h2>

      {feedback ? (
        <div className="border border-teal/30 bg-teal/5 rounded-sm p-4">
          <p className="font-serif text-2xl text-teal-dark mb-1">{feedback.score}/10</p>
          <p className="text-sm text-ink/70">{feedback.feedback}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            rows={8}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer…"
            className="w-full border border-line rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 bg-white resize-none"
          />
          <button type="submit" disabled={submitting}
            className="self-start bg-teal text-paper text-sm font-medium px-4 py-2 rounded-sm hover:bg-teal-dark transition-colors disabled:opacity-50">
            {submitting ? 'Evaluating…' : 'Submit answer'}
          </button>
        </form>
      )}
    </div>
  )
}
