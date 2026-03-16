import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children, requiredRole }) {
    const { user, isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // If a specific role is required and user doesn't have it, redirect
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/'} replace />
    }

    return children
}
