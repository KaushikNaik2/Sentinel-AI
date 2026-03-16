import { NavLink, useNavigate } from 'react-router-dom'
import {
    Shield,
    Search,
    Activity,
    UserCheck,
    Bot,
    Target,
    ChevronLeft,
    ChevronRight,
    Building2,
    LogOut,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import useSecurityStore from '../../store/securityStore'

const userNavItems = [
    { icon: Shield, label: 'Dashboard', path: '/', badge: null },
    { icon: Search, label: 'Analyzer', path: '/analyzer', badge: null },
    { icon: Activity, label: 'Monitor', path: '/monitor', badge: { count: 2, type: 'danger' } },
    { icon: UserCheck, label: 'Breach Check', path: '/breach', badge: { count: 3, type: 'warning' } },
    { icon: Bot, label: 'AI Coach', path: '/coach', badge: null },
    { icon: Target, label: 'Attack Simulator', path: '/simulator', badge: { text: 'TRAIN', type: 'info' } },
]

const adminNavItems = [
    { icon: Building2, label: 'Fleet Overview', path: '/admin/dashboard', badge: null },
    { icon: Shield, label: 'Endpoint View', path: '/', badge: null },
    { icon: Search, label: 'Analyzer', path: '/analyzer', badge: null },
    { icon: Activity, label: 'Monitor', path: '/monitor', badge: { count: 2, type: 'danger' } },
    { icon: UserCheck, label: 'Breach Check', path: '/breach', badge: { count: 3, type: 'warning' } },
    { icon: Bot, label: 'AI Coach', path: '/coach', badge: null },
    { icon: Target, label: 'Attack Simulator', path: '/simulator', badge: { text: 'TRAIN', type: 'info' } },
]

export default function Sidebar() {
    const { sidebarCollapsed, toggleSidebar } = useSecurityStore()
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const navItems = user?.role === 'ADMIN' ? adminNavItems : userNavItems

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <aside
            className={`flex flex-col border-r border-border-default bg-bg-secondary transition-all duration-200 ${sidebarCollapsed ? 'w-[68px]' : 'w-[240px]'
                }`}
            style={{ minHeight: '100vh' }}
        >
            {/* Logo */}
            <div className="flex items-center gap-2 px-4 py-5 border-b border-border-default">
                <Shield className="w-7 h-7 text-accent-green flex-shrink-0" />
                {!sidebarCollapsed && (
                    <span className="text-lg font-semibold text-text-primary tracking-tight">
                        Sentinel AI
                    </span>
                )}
            </div>

            {/* Role Badge */}
            {!sidebarCollapsed && user && (
                <div className="px-4 py-2.5 border-b border-border-default">
                    <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${user.role === 'ADMIN'
                            ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'
                            : 'bg-accent-green/10 text-accent-green border border-accent-green/20'
                        }`}>
                        {user.role === 'ADMIN' ? <Building2 className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        {user.role === 'ADMIN' ? 'Enterprise Admin' : 'Personal'}
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 py-3 space-y-1 px-2" role="navigation" aria-label="Main navigation">
                {navItems.map(({ icon: Icon, label, path, badge }) => (
                    <NavLink
                        key={path + label}
                        to={path}
                        end={path === '/' || path === '/admin/dashboard'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors duration-150 group ${isActive
                                ? 'bg-bg-hover border-l-3 border-accent-green text-accent-green'
                                : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                            }`
                        }
                    >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {!sidebarCollapsed && (
                            <>
                                <span className="text-sm font-medium flex-1">{label}</span>
                                {badge && (
                                    <span
                                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${badge.type === 'danger'
                                                ? 'bg-accent-red/15 text-accent-red'
                                                : badge.type === 'warning'
                                                    ? 'bg-accent-orange/15 text-accent-orange'
                                                    : 'bg-accent-cyan/15 text-accent-cyan'
                                            }`}
                                    >
                                        {badge.text || badge.count}
                                    </span>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom: User info + Local Model */}
            {!sidebarCollapsed && (
                <div className="px-4 py-3 border-t border-border-default space-y-2">
                    {user && (
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-text-primary font-medium">{user.name}</p>
                                <p className="text-[10px] text-text-tertiary">{user.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-1.5 rounded-md text-text-tertiary hover:text-accent-red hover:bg-accent-red/10 cursor-pointer transition-colors"
                                aria-label="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent-green animate-live-dot" />
                        <span className="text-xs text-text-secondary">LOCAL MODEL ACTIVE</span>
                    </div>
                    <span className="text-[11px] text-text-tertiary font-mono block">
                        mistral-7b
                    </span>
                </div>
            )}

            {/* Collapse toggle */}
            <button
                onClick={toggleSidebar}
                className="flex items-center justify-center py-3 border-t border-border-default text-text-tertiary hover:text-text-primary cursor-pointer transition-colors"
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
        </aside>
    )
}
