import { useState, useEffect } from 'react'
import { X, AlertTriangle } from 'lucide-react'

const stats = [
    {
        value: '4,000%',
        numericEnd: 4000,
        suffix: '%',
        label: 'surge in phishing attacks',
        sublabel: 'since AI tools became widely available',
        color: 'text-accent-red',
    },
    {
        value: '83%',
        numericEnd: 83,
        suffix: '%',
        label: 'of phishing emails are AI-generated',
        sublabel: "old advice — 'check for bad grammar' — no longer works",
        color: 'text-accent-orange',
    },
    {
        value: '88%',
        numericEnd: 88,
        suffix: '%',
        label: 'of breaches caused by human error',
        sublabel: 'not broken systems — people with no guide',
        color: 'text-accent-orange',
    },
    {
        value: '11s',
        numericEnd: 11,
        suffix: 's',
        label: 'a small business is attacked',
        sublabel: 'every 11 seconds. avg loss: $120,000',
        color: 'text-accent-red',
    },
]

function AnimatedNumber({ end, suffix, duration = 1200 }) {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        let start = 0
        const startTime = Date.now()
        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            // ease-out quad
            const eased = 1 - (1 - progress) * (1 - progress)
            const val = Math.round(eased * end)
            setCurrent(val)
            if (progress >= 1) clearInterval(timer)
        }, 16)
        return () => clearInterval(timer)
    }, [end, duration])

    const formatted = end >= 1000 ? current.toLocaleString() : current
    return <>{formatted}{suffix}</>
}

export default function StatsBanner() {
    const [dismissed, setDismissed] = useState(() => {
        return localStorage.getItem('sentinel-stats-banner-dismissed') === 'true'
    })

    const handleDismiss = () => {
        setDismissed(true)
        localStorage.setItem('sentinel-stats-banner-dismissed', 'true')
    }

    if (dismissed) return null

    return (
        <div
            className="relative bg-bg-secondary border border-accent-red/20 border-l-3 border-l-accent-red rounded-lg p-5 animate-fade-in"
        >
            {/* Dismiss */}
            <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 text-text-tertiary hover:text-text-primary cursor-pointer transition-colors"
                aria-label="Dismiss banner"
            >
                <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-accent-red" />
                <span className="text-sm font-medium text-text-primary">
                    The threat is real and it's growing fast
                </span>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="space-y-1">
                        <p className={`text-3xl font-medium ${stat.color}`}>
                            <AnimatedNumber end={stat.numericEnd} suffix={stat.suffix} />
                        </p>
                        <p className="text-[13px] text-text-secondary leading-tight">{stat.label}</p>
                        <p className="text-[11px] text-text-tertiary italic leading-tight">{stat.sublabel}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
