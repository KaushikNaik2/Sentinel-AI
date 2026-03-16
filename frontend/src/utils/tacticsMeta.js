// Tactics metadata catalog — frontend rendering data for phishing analysis results
export const TACTICS_META = {
    AUTHORITY_IMPERSONATION: {
        icon: '🔴',
        color: 'accent-red',
        name: 'Authority Impersonation',
        tip: 'Real banks, RBI, and government bodies never ask for OTP, PIN, or passwords via message or call.',
    },
    URGENCY_MANIPULATION: {
        icon: '🟠',
        color: 'accent-orange',
        name: 'Urgency Manipulation',
        tip: 'Artificial deadlines are designed to stop you thinking. Slow down — real emergencies have official channels.',
    },
    FEAR_INDUCTION: {
        icon: '🟠',
        color: 'accent-orange',
        name: 'Fear Induction',
        tip: 'Threat of losing money or access triggers panic response. Take 60 seconds before clicking anything.',
    },
    OTP_HARVESTING: {
        icon: '🔴',
        color: 'accent-red',
        name: 'OTP Harvesting',
        tip: 'No legitimate service needs your OTP. If someone asks for it — it is a scam, 100% of the time.',
    },
    SOCIAL_PROOF: {
        icon: '🟡',
        color: 'accent-yellow',
        name: 'False Social Proof',
        tip: "Claims like 'other customers have verified' or 'as per RBI guidelines' are fabricated to seem legitimate.",
    },
    SCARCITY: {
        icon: '🟡',
        color: 'accent-yellow',
        name: 'Scarcity / Limited Time',
        tip: "Real offers don't disappear in 2 hours. Artificial scarcity is a classic manipulation pattern.",
    },
    PERSONALIZATION: {
        icon: '🔴',
        color: 'accent-red',
        name: 'AI Personalization',
        tip: 'AI scraped your public data to craft this. Your name, bank, and recent activity can all be found online.',
    },
}

// Mock analysis result for demo
export const MOCK_ANALYSIS_RESULT = {
    risk_score: 94,
    threat_level: 'HIGH RISK',
    threat_type: 'Phishing',
    ai_generated_likelihood: 87,
    tactics: [
        {
            type: 'AUTHORITY_IMPERSONATION',
            severity: 'HIGH',
            evidence: '"State Bank of India Security Team"',
            explanation: 'Poses as your bank to trigger automatic compliance. The sender name mimics official communications.',
        },
        {
            type: 'URGENCY_MANIPULATION',
            severity: 'HIGH',
            evidence: '"Your account will be suspended within 24 hours"',
            explanation: 'Creates artificial time pressure to bypass your critical thinking. Real banks give reasonable notice.',
        },
        {
            type: 'FEAR_INDUCTION',
            severity: 'MEDIUM',
            evidence: '"unauthorized transaction of ₹49,999 detected"',
            explanation: 'Specific monetary amounts trigger loss aversion — you panic and click before you think.',
        },
        {
            type: 'OTP_HARVESTING',
            severity: 'HIGH',
            evidence: '"please verify by entering your OTP"',
            explanation: 'The sole purpose of this email is to steal your OTP. No bank ever asks for OTP in emails.',
        },
    ],
    why_looks_real:
        'This email is convincing because it uses your bank\'s official color scheme, references a specific and plausible transaction amount (₹49,999), and the sender domain "sbi-alerts.co.in" differs by only one character from the real bank domain "sbi.co.in". The professional formatting with proper header/footer structure and the inclusion of a customer care number add legitimacy.',
    highlights: [
        { start: 0, end: 35, type: 'authority', reason: 'Impersonates bank security team' },
        { start: 89, end: 145, type: 'urgency', reason: 'Artificial deadline creates panic' },
        { start: 178, end: 230, type: 'fear', reason: 'Specific amount triggers loss aversion' },
        { start: 265, end: 310, type: 'otp', reason: 'OTP harvesting — never share OTP via email' },
    ],
    url_scan: { verdict: 'MALICIOUS', virustotal: '12/72 engines' },
    summary: 'This is a high-confidence phishing email designed to steal your banking OTP through authority impersonation and urgency manipulation.',
}

export const SAMPLE_EMAIL = `From: SBI Security Team <alerts@sbi-alerts.co.in>
Subject: URGENT: Unauthorized Transaction Detected on Your Account

Dear Valued Customer,

We have detected an unauthorized transaction of ₹49,999 on your State Bank of India account ending in **4521. This transaction was initiated from an unrecognized device in Hyderabad.

Your account will be suspended within 24 hours if this transaction is not verified immediately.

To secure your account, please verify your identity by entering your OTP at the link below:

→ https://sbi-secure-verify.co.in/auth/verify-otp

If you did not initiate this transaction, please verify immediately to prevent further unauthorized access to your account.

For assistance, contact our 24/7 customer care: 1800-XXX-XXXX

Regards,
SBI Digital Banking Security Team
State Bank of India`
