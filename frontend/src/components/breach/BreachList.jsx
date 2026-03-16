import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Globe, Calendar } from 'lucide-react'
import { SEVERITY_META, DATA_TYPE_COLORS } from '../../utils/breachMeta'

function AnimatedCount({ target }) {
    const [value, setValue] = useState(0)

    useEffect(() => {
        const duration = 1200
        const startTime = Date.now()
        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - (1 - progress) * (1 - progress)
            setValue(Math.round(eased * target))
            if (progress >= 1) clearInterval(timer)
        }, 16)
        return () => clearInterval(timer)
    }, [target])

    return <span>{value.toLocaleString()}</span>
}

export default function BreachList({ breaches }) {
    const [expandedId, setExpandedId] = useState(null)

    const toggle = (id) => {
        setExpandedId((prev) => (prev === id ? null : id))
    }

    return (
        <div className="space-y-3">
            <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                Breaches Found ({breaches.length})
            </h3>

            {breaches.map((breach) => {
                const meta = SEVERITY_META[breach.severity]
                const isExpanded = expandedId === breach.id

                return (
                    <div
                        key={breach.id}
                        className={`bg-bg-tertiary border border-border-default border-l-3 ${meta.border} rounded-lg overflow-hidden transition-all duration-200`}
                    >
                        {/* Header — always visible */}
                        <button
                            onClick={() => toggle(breach.id)}
                            className="w-full p-4 flex items-center justify-between cursor-pointer hover:bg-bg-hover/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div>
                                    <span className="text-sm font-semibold text-text-primary">
                                        {breach.name}
                                    </span>
                                    <span className="text-xs text-text-tertiary ml-2">{breach.year}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-xs font-mono text-text-secondary">
                                    <AnimatedCount target={breach.recordCount} /> records
                                </span>
                                <span
                                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase ${meta.bg} text-${meta.color}`}
                                >
                                    {breach.severity}
                                </span>
                                {isExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-text-tertiary" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-text-tertiary" />
                                )}
                            </div>
                        </button>

                        {/* Data type chips — always visible */}
                        <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                            {breach.dataTypes.map((type) => (
                                <span
                                    key={type}
                                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${DATA_TYPE_COLORS[type] || 'bg-bg-hover text-text-tertiary border-border-default'}`}
                                >
                                    {type.replace('_', ' ')}
                                </span>
                            ))}
                        </div>

                        {/* Expanded details */}
                        {isExpanded && (
                            <div className="px-4 pb-4 pt-2 border-t border-border-default space-y-2 animate-fade-in">
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    {breach.description}
                                </p>
                                <div className="flex items-center gap-4 text-[11px] text-text-tertiary">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {breach.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Globe className="w-3 h-3" />
                                        <span className="font-mono">{breach.domain}</span>
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
