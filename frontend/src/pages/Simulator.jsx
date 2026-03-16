import { useState, useCallback } from 'react'
import { Target } from 'lucide-react'
import SetupForm from '../components/simulator/SetupForm'
import EmailShell from '../components/simulator/EmailShell'
import RedFlagSelector from '../components/simulator/RedFlagSelector'
import ScoreReveal from '../components/simulator/ScoreReveal'
import useSecurityStore from '../store/securityStore'
import { generateMockAttack, scoreMockAttempt } from '../utils/simulatorMeta'

export default function Simulator() {
    const [step, setStep] = useState(1) // 1 = setup, 2 = attack, 3 = results
    const [generating, setGenerating] = useState(false)
    const [attack, setAttack] = useState(null)
    const [selectedFlags, setSelectedFlags] = useState(new Set())
    const [result, setResult] = useState(null)
    const [scoreDelta, setScoreDelta] = useState(0)
    const addTrainingScore = useSecurityStore((s) => s.addTrainingScore)

    const handleGenerate = useCallback(({ name, bank, role, difficulty }) => {
        setGenerating(true)
        setAttack(null)
        setSelectedFlags(new Set())
        setResult(null)

        setTimeout(() => {
            const mockAttack = generateMockAttack(name, bank, role, difficulty)
            setAttack(mockAttack)
            setGenerating(false)
            setStep(2)
        }, 1500)
    }, [])

    const handleToggleFlag = useCallback((flagId) => {
        setSelectedFlags((prev) => {
            const next = new Set(prev)
            if (next.has(flagId)) next.delete(flagId)
            else next.add(flagId)
            return next
        })
    }, [])

    const handleSubmitFlags = useCallback(() => {
        if (!attack || selectedFlags.size === 0) return

        const scoreResult = scoreMockAttempt(attack, Array.from(selectedFlags))
        setResult(scoreResult)
        setScoreDelta(scoreResult.score_delta)
        addTrainingScore(scoreResult.score_delta)
        setStep(3)
    }, [attack, selectedFlags, addTrainingScore])

    const handleRetry = useCallback(() => {
        setStep(1)
        setAttack(null)
        setSelectedFlags(new Set())
        setResult(null)
        setScoreDelta(0)
    }, [])

    return (
        <div className="animate-fade-in space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between border-b border-border-default pb-4">
                <div>
                    <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
                        <Target className="w-6 h-6 text-accent-red" />
                        Attack Simulator
                    </h2>
                    <p className="text-sm text-text-secondary mt-1">
                        Train your instincts. Spot the fake before it's too late.
                    </p>
                </div>
                {/* Step indicator */}
                <div className="flex items-center gap-2">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-1.5">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                step >= s
                                    ? 'bg-accent-green/15 text-accent-green border border-accent-green/40'
                                    : 'bg-bg-tertiary text-text-tertiary border border-border-default'
                            }`}>
                                {s}
                            </div>
                            {s < 3 && (
                                <div className={`w-8 h-0.5 rounded ${step > s ? 'bg-accent-green' : 'bg-bg-tertiary'}`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step 1: Setup */}
            {step === 1 && (
                <SetupForm onGenerate={handleGenerate} isLoading={generating} />
            )}

            {/* Step 2: Attack + Flag Selection */}
            {step === 2 && attack && (
                <div className="space-y-6 animate-fade-in">
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-4">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-orange/15 text-accent-orange text-xs font-bold">2</span>
                            The Attack
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent-red/15 text-accent-red border border-accent-red/30 ml-2">
                                SIMULATED — NOT REAL
                            </span>
                        </h3>
                        <EmailShell attack={attack} />
                    </div>

                    <RedFlagSelector
                        flags={attack.red_flags}
                        selectedIds={selectedFlags}
                        onToggle={handleToggleFlag}
                        onSubmit={handleSubmitFlags}
                    />
                </div>
            )}

            {/* Step 3: Score Reveal */}
            {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                    <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-green/15 text-accent-green text-xs font-bold">3</span>
                        Your Score
                    </h3>
                    <ScoreReveal
                        result={result}
                        scoreDelta={scoreDelta}
                        onRetry={handleRetry}
                    />
                </div>
            )}
        </div>
    )
}
