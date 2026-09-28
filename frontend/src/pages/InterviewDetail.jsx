import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios.js'

export default function InterviewDetail() {
  const { id } = useParams()
  const [interview, setInterview] = useState(null)
  const [questions, setQuestions] = useState([])
  const [error, setError] = useState('')
  const [generating, setGenerating] = useState(false)
  const navigate = useNavigate()

  const load = async () => {
    try {
      const [interviewRes, questionsRes] = await Promise.all([
        api.get(`/interviews/${id}`),
        api.get(`/questions/${id}`),
      ])
      setInterview(interviewRes.data.interview)
      setQuestions(questionsRes.data.questions)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load interview')
    }
  }

  useEffect(() => { load() }, [id])

  const handleGenerate = async () => {
    setGenerating(true)
    setError('')
    try {
      await api.post(`/questions/generate/${id}`)
      await load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not generate questions')
    } finally {
      setGenerating(false)
    }
  }

  const handleStart = async () => {
    try {
      await api.post(`/interviews/${id}/start`)
      navigate(`/interviews/${id}/take`)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start interview')
    }
  }

  if (error) return <p className="text-red-600 text-sm">{error}</p>
  if (!interview) return <p className="text-ink/50 text-sm">Loading…</p>

  return (
    <div className="max-w-2xl">
      <h2 className="font-serif text-2xl font-semibold mb-1">{interview.title}</h2>
      <p className="text-sm text-ink/60 mb-6">{interview.company} · {interview.role} · {interview.difficulty}</p>

      {questions.length === 0 ? (
        <div className="border border-line rounded-sm p-6 text-center">
          <p className="text-sm text-ink/60 mb-4">No questions yet for this interview.</p>
          <button onClick={handleGenerate} disabled={generating}
            className="bg-teal text-paper text-sm font-medium px-4 py-2 rounded-sm hover:bg-teal-dark transition-colors disabled:opacity-50">
            {generating ? 'Generating with AI…' : 'Generate questions with AI'}
          </button>
        </div>
      ) : (
        <>
          <div className="border-t border-line mb-6">
            {questions.map((q) => (
              <div key={q._id} className="py-3 border-b border-line flex items-center justify-between">
                <span className="text-sm">{q.order}. {q.questionText}</span>
                <span className="text-xs text-ink/40">{q.type} · {q.difficulty}</span>
              </div>
            ))}
          </div>
          {interview.status === 'comleted' ? (
            <button onClick={() => navigate(`/interviews/${id}/results`)}
              className="bg-teal text-paper text-sm font-medium px-4 py-2 rounded-sm hover:bg-teal-dark transition-colors">
              View results
            </button>
          ) : (
            <button onClick={handleStart}
              className="bg-teal text-paper text-sm font-medium px-4 py-2 rounded-sm hover:bg-teal-dark transition-colors">
              {interview.status === 'inprogress' ? 'Resume interview' : 'Start interview'}
            </button>
          )}
        </>
      )}
    </div>
  )
}
