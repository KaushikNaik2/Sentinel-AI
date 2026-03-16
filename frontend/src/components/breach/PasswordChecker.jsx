import { useState, useMemo } from 'react'
import { Eye, EyeOff, Check, X, AlertTriangle, Lock } from 'lucide-react'
import { COMMON_PASSWORDS } from '../../utils/breachMeta'

const CRITERIA = [
    { key: 'length8', label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { key: 'uppercase', label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { key: 'lowercase', label: 'Contains lowercase letter', test: (p) => /[a-z]/.test(p) },
    { key: 'number', label: 'Contains a number', test: (p) => /\d/.test(p) },
    { key: 'special', label: 'Contains special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
    { key: 'length12', label: '12+ characters (bonus)', test: (p) => p.length >= 12 },
]

const STRENGTH_LEVELS = [
    { min: 0, max: 1, label: 'Very Weak', color: 'accent-red', segments: 1 },
    { min: 2, max: 3, label: 'Weak', color: 'accent-orange', segments: 2 },
    { min: 4, max: 4, label: 'Fair', color: 'accent-yellow', segments: 3 },
    { min: 5, max: 6, label: 'Strong', color: 'accent-green', segments: 4 },
]

export default function PasswordChecker() {
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const results = useMemo(() => {
        if (!password) return { passed: 0, checks: [], isBreached: false, strength: null }

        const checks = CRITERIA.map((c) => ({
            ...c,
            passed: c.test(password),
        }))
        const passed = checks.filter((c) => c.passed).length
        const isBreached = COMMON_PASSWORDS.includes(password.toLowerCase())
        const strength = STRENGTH_LEVELS.find((s) => passed >= s.min && passed <= s.max)

        return { passed, checks, isBreached, strength }
    }, [password])

    return (
        <div className="bg-bg-secondary border border-border-default rounded-lg p-5 space-y-4">
            {/* Header */}
            <div>
                <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5" />
                    Password Strength Checker
                </h3>
                <p className="text-[11px] text-text-tertiary mt-1">
                    Check locally — nothing leaves your device
                </p>
            </div>

            {/* Password input */}
            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a password to check..."
                    className="w-full bg-bg-tertiary border border-border-default rounded-lg px-4 py-2.5 pr-10
                     text-sm font-mono text-text-primary placeholder-text-tertiary
                     caret-accent-green
                     focus:outline-none focus:border-accent-green/40 focus:ring-1 focus:ring-accent-green/20
                     transition-colors"
                />
                <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary cursor-pointer transition-colors"
                >
                    {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                    ) : (
                        <Eye className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* Strength meter and checks — only show when password entered */}
            {password && (
                <>
                    {/* 4-segment strength bar */}
                    <div className="space-y-2">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4].map((seg) => (
                                <div
                                    key={seg}
                                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                                        results.strength && seg <= results.strength.segments
                                            ? `bg-${results.strength.color}`
                                            : 'bg-bg-tertiary'
                                    }`}
                                />
                            ))}
                        </div>
                        {results.strength && (
                            <span className={`text-xs font-medium text-${results.strength.color}`}>
                                {results.strength.label}
                            </span>
                        )}
                    </div>

                    {/* Criteria checklist */}
                    <div className="space-y-1.5">
                        {results.checks.map((check) => (
                            <div key={check.key} className="flex items-center gap-2">
                                {check.passed ? (
                                    <Check className="w-3.5 h-3.5 text-accent-green" />
                                ) : (
                                    <X className="w-3.5 h-3.5 text-accent-red" />
                                )}
                                <span
                                    className={`text-xs ${
                                        check.passed ? 'text-text-secondary' : 'text-text-tertiary'
                                    }`}
                                >
                                    {check.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Breach warning */}
                    {results.isBreached && (
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-accent-red/10 border border-accent-red/30">
                            <AlertTriangle className="w-4 h-4 text-accent-red flex-shrink-0 mt-0.5" />
                            <div>
                                <span className="text-xs font-semibold text-accent-red">Breached Password</span>
                                <p className="text-[11px] text-accent-red/80 mt-0.5">
                                    This password appears in known breach databases. Do not use it.
                                </p>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
