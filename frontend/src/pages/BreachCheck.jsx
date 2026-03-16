import { useState, useCallback } from 'react'
import { UserCheck } from 'lucide-react'
import EmailInput from '../components/breach/EmailInput'
import BreachList from '../components/breach/BreachList'
import AIRecommendations from '../components/breach/AIRecommendations'
import PasswordChecker from '../components/breach/PasswordChecker'
import SecurityScoreCard from '../components/dashboard/SecurityScoreCard'
import useSecurityStore from '../store/securityStore'
import { MOCK_BREACHES, MOCK_RECOMMENDATIONS } from '../utils/breachMeta'

const BASE_SCORE = 34

export default function BreachCheck() {
    const [scanning, setScanning] = useState(false)
    const [scanned, setScanned] = useState(false)
    const [scannedEmail, setScannedEmail] = useState('')
    const [breaches, setLocalBreaches] = useState([])
    const [displayScore, setDisplayScore] = useState(72)
    const { setBreaches, setScore } = useSecurityStore()

    const handleScan = useCallback((email) => {
        // Reset flow
        if (email === null) {
            setScanned(false)
            setScannedEmail('')
            setLocalBreaches([])
            setDisplayScore(72)
            setScore(72)
            setBreaches([])
            return
        }

        setScanning(true)
        setScanned(false)
        setLocalBreaches([])

        setTimeout(() => {
            setScanning(false)
            setScanned(true)
            setScannedEmail(email)
            setLocalBreaches(MOCK_BREACHES)
            setBreaches(MOCK_BREACHES)
            setScore(BASE_SCORE)
            setDisplayScore(BASE_SCORE)
        }, 1500)
    }, [setBreaches, setScore])

    const handleProgressChange = useCallback((completed, total) => {
        const newScore = Math.round(BASE_SCORE + (completed / total) * (100 - BASE_SCORE))
        setScore(newScore)
        setDisplayScore(newScore)
    }, [setScore])

    return (
        <div className="animate-fade-in space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between border-b border-border-default pb-4">
                <div>
                    <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
                        <UserCheck className="w-6 h-6 text-accent-orange" />
                        Personal Security Risk Profile
                    </h2>
                    <p className="text-sm text-text-secondary mt-1">
                        Check if your email has been exposed in data breaches
                    </p>
                </div>
                {scanned && (
                    <div className="flex items-center gap-2 bg-bg-tertiary px-3 py-1.5 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-accent-orange animate-live-dot" />
                        <span className="text-xs text-accent-orange font-medium">
                            {breaches.length} breaches found
                        </span>
                    </div>
                )}
            </div>

            {/* Email Input */}
            <EmailInput
                onScan={handleScan}
                isLoading={scanning}
                scannedEmail={scanned ? scannedEmail : ''}
            />

            {/* Results — 2-column layout */}
            {scanned && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-fade-in">
                    {/* Left Column — Breach list */}
                    <div className="lg:col-span-3">
                        <BreachList breaches={breaches} />
                    </div>

                    {/* Right Column — Score + Recommendations + Password */}
                    <div className="lg:col-span-2 space-y-6">
                        <SecurityScoreCard score={displayScore} />
                        <AIRecommendations
                            recommendations={MOCK_RECOMMENDATIONS}
                            onProgressChange={handleProgressChange}
                        />
                        <PasswordChecker />
                    </div>
                </div>
            )}
        </div>
    )
}
