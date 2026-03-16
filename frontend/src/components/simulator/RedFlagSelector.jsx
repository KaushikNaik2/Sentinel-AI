import { Flag, Send } from 'lucide-react'
import { FLAG_TYPES } from '../../utils/simulatorMeta'

export default function RedFlagSelector({ flags, selectedIds, onToggle, onSubmit }) {
    if (!flags || flags.length === 0) return null

    return (
        <div className="bg-bg-secondary border border-border-default rounded-lg p-5 space-y-4">
            <div>
                <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                    <Flag className="w-4 h-4 text-accent-orange" />
                    How many red flags can you spot?
                </h3>
                <p className="text-xs text-text-tertiary mt-1">
                    Select every element you think is suspicious. Look carefully at the sender, links, language, and requests.
                </p>
            </div>

            {/* Flag chips */}
            <div className="flex flex-wrap gap-2">
                {flags.map((flag) => {
                    const isSelected = selectedIds.has(flag.id)
                    const meta = FLAG_TYPES[flag.type] || { label: flag.type, color: 'accent-orange' }

                    return (
                        <button
                            key={flag.id}
                            onClick={() => onToggle(flag.id)}
                            className={`px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer
                             transition-all duration-200 ${
                                isSelected
                                    ? `bg-${meta.color}/15 text-${meta.color} border-${meta.color}/40`
                                    : 'bg-bg-tertiary text-text-secondary border-border-default hover:bg-bg-hover hover:border-border-default'
                            }`}
                        >
                            <span className="flex items-center gap-1.5">
                                {isSelected && <span className="text-xs">&#10003;</span>}
                                {meta.label}: &ldquo;{flag.quote?.slice(0, 40)}{flag.quote?.length > 40 ? '...' : ''}&rdquo;
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between">
                <span className="text-xs text-text-tertiary">
                    {selectedIds.size} of {flags.length} flags selected
                </span>
                <button
                    onClick={onSubmit}
                    disabled={selectedIds.size === 0}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-sm
                     bg-accent-green text-bg-primary cursor-pointer
                     hover:bg-accent-green/90 disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-200"
                >
                    <Send className="w-4 h-4" />
                    SUBMIT MY ANSWERS
                </button>
            </div>
        </div>
    )
}
