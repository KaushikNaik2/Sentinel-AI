import { useState } from 'react'
import { Loader2, Zap } from 'lucide-react'
import { DIFFICULTY_META, ATTACK_TYPES } from '../../utils/simulatorMeta'

export default function SetupForm({ onGenerate, isLoading }) {
    const [name, setName] = useState('')
    const [bank, setBank] = useState('')
    const [role, setRole] = useState('')
    const [difficulty, setDifficulty] = useState('medium')
    const [attackType, setAttackType] = useState('email')

    const handleSubmit = () => {
        if (!name.trim() || !bank.trim()) return
        onGenerate({ name: name.trim(), bank: bank.trim(), role: role.trim() || 'individual', difficulty, attackType })
    }

    const inputClass = `w-full bg-bg-tertiary border border-border-default rounded-lg px-4 py-2.5
     text-sm text-text-primary placeholder-text-tertiary caret-accent-green
     focus:outline-none focus:border-accent-green/40 focus:ring-1 focus:ring-accent-green/20
     transition-colors`

    return (
        <div className="bg-bg-secondary border border-border-default rounded-lg p-6 space-y-5">
            <div>
                <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-cyan/15 text-accent-cyan text-xs font-bold">1</span>
                    About You
                </h3>
                <p className="text-xs text-text-tertiary mt-1 ml-8">Personalizes the attack for realistic training</p>
            </div>

            {/* Input fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">Your Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Shivam Patel"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">Your Bank / Organization</label>
                    <input
                        type="text"
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                        placeholder="e.g. State Bank of India"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">Your Role (optional)</label>
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. Software Engineer"
                        className={inputClass}
                    />
                </div>
            </div>

            {/* Difficulty selector */}
            <div>
                <label className="block text-xs font-medium text-text-secondary mb-2">Difficulty</label>
                <div className="flex gap-3">
                    {Object.entries(DIFFICULTY_META).map(([key, meta]) => (
                        <button
                            key={key}
                            onClick={() => setDifficulty(key)}
                            className={`flex-1 p-3 rounded-lg border text-left cursor-pointer transition-all duration-200 ${
                                difficulty === key
                                    ? `border-${meta.color}/50 bg-${meta.color}/10`
                                    : 'border-border-default bg-bg-tertiary hover:bg-bg-hover'
                            }`}
                        >
                            <span className={`text-sm font-semibold text-${meta.color}`}>{meta.label}</span>
                            <p className="text-[11px] text-text-tertiary mt-0.5">{meta.description}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Attack type */}
            <div>
                <label className="block text-xs font-medium text-text-secondary mb-2">Attack Type</label>
                <div className="flex gap-2">
                    {ATTACK_TYPES.map((type) => (
                        <button
                            key={type.key}
                            onClick={() => setAttackType(type.key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 ${
                                attackType === type.key
                                    ? 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/40'
                                    : 'bg-bg-tertiary text-text-secondary border border-border-default hover:bg-bg-hover'
                            }`}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Generate button */}
            <button
                onClick={handleSubmit}
                disabled={isLoading || !name.trim() || !bank.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm
                 bg-accent-green text-bg-primary cursor-pointer
                 hover:bg-accent-green/90 disabled:opacity-40 disabled:cursor-not-allowed
                 transition-all duration-200"
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Zap className="w-4 h-4" />
                )}
                {isLoading ? 'Generating Attack...' : 'GENERATE ATTACK'}
            </button>
        </div>
    )
}
