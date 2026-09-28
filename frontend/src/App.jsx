import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CreateInterview from './pages/CreateInterview.jsx'
import InterviewDetail from './pages/InterviewDetail.jsx'
import TakeInterview from './pages/TakeInterview.jsx'
import Results from './pages/Results.jsx'
import Profile from './pages/Profile.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Sidebar from './components/Sidebar.jsx'

function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <main className="flex-1 px-10 py-8 max-w-5xl">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/interviews/new" element={<ProtectedRoute><Layout><CreateInterview /></Layout></ProtectedRoute>} />
      <Route path="/interviews/:id" element={<ProtectedRoute><Layout><InterviewDetail /></Layout></ProtectedRoute>} />
      <Route path="/interviews/:id/take" element={<ProtectedRoute><Layout><TakeInterview /></Layout></ProtectedRoute>} />
      <Route path="/interviews/:id/results" element={<ProtectedRoute><Layout><Results /></Layout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
    </Routes>
  )
}
