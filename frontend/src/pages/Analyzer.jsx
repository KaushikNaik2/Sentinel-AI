import { useState, useCallback } from 'react'
import { Search } from 'lucide-react'
import TextInput from '../components/analyzer/TextInput'
import ResultHighlighter from '../components/analyzer/ResultHighlighter'
import ThreatDetails from '../components/analyzer/ThreatDetails'
import { MOCK_ANALYSIS_RESULT, SAMPLE_EMAIL } from '../utils/tacticsMeta'

export default function Analyzer() {
    const [analyzing, setAnalyzing] = useState(false)
    const [result, setResult] = useState(null)
    const [analyzedText, setAnalyzedText] = useState('')

    const handleAnalyze = useCallback(({ text, url }) => {
        setAnalyzing(true)
        setResult(null)

        // Simulate API delay
        setTimeout(() => {
            setAnalyzing(false)
            // Use sample text if none provided, but we already disallow empty submits in TextInput
            setAnalyzedText(text || SAMPLE_EMAIL)
            setResult(MOCK_ANALYSIS_RESULT)
        }, 1500)
    }, [])

    const handleTestSample = () => {
        handleAnalyze({ text: SAMPLE_EMAIL, url: '' })
    }

    return (
        <div className="animate-fade-in space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between border-b border-border-default pb-4">
                <div>
                    <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
                        <Search className="w-6 h-6 text-accent-cyan" />
                        Phishing & Scam Analyzer
                    </h2>
                    <p className="text-sm text-text-secondary mt-1">
                        Paste suspicious emails, SMS, or URLs to detect psychological manipulation and threats.
                    </p>
                </div>

                {/* Load Sample Button */}
                {!result && !analyzing && (
                    <button
                        onClick={handleTestSample}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-bg-tertiary border border-border-default text-text-secondary hover:text-text-primary hover:border-text-tertiary transition-colors"
                    >
                        Load Sample Email
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Input + Highlights */}
                <div className="space-y-6">
                    <TextInput onAnalyze={handleAnalyze} isLoading={analyzing} />

                    {result && (
                        <ResultHighlighter text={analyzedText} highlights={result.highlights} />
                    )}
                </div>

                {/* Right Column: Threat Details */}
                <div className="space-y-6">
                    {result ? (
                        <ThreatDetails result={result} />
                    ) : (
                        <div className="bg-bg-secondary border border-border-default rounded-lg p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                            <div className="w-16 h-16 rounded-full bg-bg-tertiary flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-text-tertiary" />
                            </div>
                            <h3 className="text-base font-semibold text-text-primary">Awaiting Input</h3>
                            <p className="text-sm text-text-secondary mt-2 max-w-sm">
                                Paste a suspicious message to begin analysis. The local AI will break down psychological tactics and verify URLs.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
