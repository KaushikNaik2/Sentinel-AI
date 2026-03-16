import { createContext, useContext, useState, useCallback } from 'react'

// Mock users for demo
const MOCK_USERS = {
    admin: {
        id: 'admin-001',
        name: 'Kaushik Naik',
        role: 'ADMIN',
        network_id: 'net-sentinel-001',
        email: 'kaushik@sentinelai.co',
    },
    user: {
        id: 'user-001',
        name: 'Shivam Patel',
        role: 'USER',
        network_id: 'net-sentinel-001',
        email: 'shivam@company.com',
    },
}

// Mock fleet/network data
export const MOCK_NETWORK = {
    id: 'net-sentinel-001',
    company_name: 'Sentinel AI Corp',
    active_endpoints: 4,
}

export const MOCK_ENDPOINTS = [
    { id: 'ep-001', name: "Kaushik's MacBook Pro", os: 'macOS 15.2', status: 'online', score: 82, threats: 0, lastSeen: '2 min ago' },
    { id: 'ep-002', name: "Shivam's PC", os: 'Windows 11', status: 'online', score: 61, threats: 2, lastSeen: '1 min ago' },
    { id: 'ep-003', name: "Prathamesh's Laptop", os: 'Windows 11', status: 'online', score: 74, threats: 1, lastSeen: 'Just now' },
    { id: 'ep-004', name: "Dev Server", os: 'Ubuntu 22.04', status: 'warning', score: 45, threats: 3, lastSeen: '5 min ago' },
]

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)

    const login = useCallback((role) => {
        const mockUser = role === 'ADMIN' ? MOCK_USERS.admin : MOCK_USERS.user
        setUser(mockUser)
    }, [])

    const logout = useCallback(() => {
        setUser(null)
    }, [])

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
