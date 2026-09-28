import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios.js'

const inputCls = "w-full border border-line rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 bg-white"

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm text-ink/70 mb-1">{label}</label>
      {children}
    </div>
  )
}

export default function CreateInterview() {
  const [form, setForm] = useState({
    title: '', company: '', role: '', experienceLevel: 'Mid',
    difficulty: 'Medium', techStack: '', numberOfQuestions: 5,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/interviews', {
        ...form,
        numberOfQuestions: Number(form.numberOfQuestions),
        techStack: form.techStack.split(',').map((s) => s.trim()).filter(Boolean),
      })
      const id = data._id || data.interview?._id
      navigate(`/interviews/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create interview')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h2 className="font-serif text-2xl font-semibold mb-6">New interview</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Title">
          <input required value={form.title} onChange={update('title')} className={inputCls} placeholder="Backend Developer — Round 1" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Company">
            <input required value={form.company} onChange={update('company')} className={inputCls} placeholder="Acme Corp" />
          </Field>
          <Field label="Role">
            <input required value={form.role} onChange={update('role')} className={inputCls} placeholder="Backend Developer" />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Experience">
            <select value={form.experienceLevel} onChange={update('experienceLevel')} className={inputCls}>
              <option>Entry</option><option>Mid</option><option>Senior</option>
            </select>
          </Field>
          <Field label="Difficulty">
            <select value={form.difficulty} onChange={update('difficulty')} className={inputCls}>
              <option>Easy</option><option>Medium</option><option>Hard</option>
            </select>
          </Field>
          <Field label="# Questions">
            <input type="number" min={1} max={15} value={form.numberOfQuestions} onChange={update('numberOfQuestions')} className={inputCls} />
          </Field>
        </div>
        <Field label="Tech stack (comma separated)">
          <input required value={form.techStack} onChange={update('techStack')} className={inputCls} placeholder="Node.js, MongoDB, Express" />
        </Field>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading}
          className="self-start bg-teal text-paper text-sm font-medium px-4 py-2 rounded-sm hover:bg-teal-dark transition-colors disabled:opacity-50">
          {loading ? 'Creating…' : 'Create interview'}
        </button>
      </form>
    </div>
  )
}
