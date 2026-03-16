import { useEffect, useState, useRef } from 'react'

export default function SecurityScoreCard({ score = 72 }) {
    const [animatedScore, setAnimatedScore] = useState(0)
    const circumference = 2 * Math.PI * 54 // radius = 54

    useEffect(() => {
        let start = 0
        const duration = 1500
        const startTime = Date.now()
        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - (1 - progress) * (1 - progress)
            setAnimatedScore(Math.round(eased * score))
            if (progress >= 1) clearInterval(timer)
        }, 16)
        return () => clearInterval(timer)
    }, [score])

    const getColor = (s) => {
        if (s >= 71) return '#00ff88'
        if (s >= 41) return '#ff6b35'
        return '#ff3b5c'
    }

    const getLabel = (s) => {
        if (s >= 71) return 'Good'
        if (s >= 41) return 'Fair'
        return 'Poor'
    }

    const color = getColor(animatedScore)
    const dashOffset = circumference - (animatedScore / 100) * circumference

    return (
        <div className="bg-bg-secondary border border-border-default rounded-lg p-6 flex flex-col items-center justify-center">
            {/* SVG Gauge */}
            <div className="relative w-36 h-36">
                <svg className="transform -rotate-90 w-36 h-36" viewBox="0 0 120 120">
                    {/* Background circle */}
                    <circle
                        cx="60" cy="60" r="54"
                        fill="none"
                        stroke="#1e2a42"
                        strokeWidth="8"
                    />
                    {/* Score arc */}
                    <circle
                        cx="60" cy="60" r="54"
                        fill="none"
                        stroke={color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        style={{
                            transition: 'stroke-dashoffset 0.3s ease',
                            filter: `drop-shadow(0 0 8px ${color}40)`,
                        }}
                    />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold" style={{ color }}>{animatedScore}</span>
                    <span className="text-[11px] text-text-tertiary uppercase tracking-wider">{getLabel(animatedScore)}</span>
                </div>
            </div>

            <p className="text-sm text-text-secondary mt-3 text-center">Your Security Score</p>
            <p className="text-xs text-text-tertiary mt-1 text-center">
                {animatedScore >= 71
                    ? 'Your system looks healthy. Keep it up!'
                    : animatedScore >= 41
                        ? 'Some issues need your attention.'
                        : 'Critical issues detected. Act now.'}
            </p>
        </div>
    )
}
