import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
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

export default function Profile() {
  const { user, setUser } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '', bio: user?.bio || '',
    skills: (user?.skills || []).join(', '), github: user?.github || '', Linkedin: user?.Linkedin || '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)
    try {
      const { data } = await api.put('/auth/profile', form)
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
      setMessage('Profile updated')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h2 className="font-serif text-2xl font-semibold mb-6">Profile</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Name"><input value={form.name} onChange={update('name')} className={inputCls} /></Field>
        <Field label="Bio"><textarea rows={3} value={form.bio} onChange={update('bio')} className={inputCls} /></Field>
        <Field label="Skills (comma separated)"><input value={form.skills} onChange={update('skills')} className={inputCls} /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="GitHub"><input value={form.github} onChange={update('github')} className={inputCls} /></Field>
          <Field label="LinkedIn"><input value={form.Linkedin} onChange={update('Linkedin')} className={inputCls} /></Field>
        </div>
        {message && <p className="text-sm text-teal-dark">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading}
          className="self-start bg-teal text-paper text-sm font-medium px-4 py-2 rounded-sm hover:bg-teal-dark transition-colors disabled:opacity-50">
          {loading ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}
