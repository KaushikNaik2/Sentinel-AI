// Attack Simulator mock data — templates for different difficulties and attack types

export const DIFFICULTY_META = {
    easy: {
        label: 'Easy',
        color: 'accent-green',
        description: 'Obvious red flags — spelling errors, generic greetings',
    },
    medium: {
        label: 'Medium',
        color: 'accent-orange',
        description: 'Subtle red flags — typosquat domains, mild urgency',
    },
    hard: {
        label: 'Hard',
        color: 'accent-red',
        description: 'Near-perfect — professional tone, personalized details',
    },
}

export const ATTACK_TYPES = [
    { key: 'email', label: 'Email' },
    { key: 'sms', label: 'SMS' },
    { key: 'whatsapp', label: 'WhatsApp' },
]

export const FLAG_TYPES = {
    SENDER_DOMAIN: { label: 'Suspicious Sender', color: 'accent-red' },
    URGENCY: { label: 'Urgency Language', color: 'accent-orange' },
    GRAMMAR: { label: 'Grammar Errors', color: 'accent-yellow' },
    GENERIC_GREETING: { label: 'Generic Greeting', color: 'accent-orange' },
    LINK_MISMATCH: { label: 'Suspicious Link', color: 'accent-red' },
    REQUEST_TYPE: { label: 'Sensitive Data Request', color: 'accent-red' },
    LOGO: { label: 'Logo Mismatch', color: 'accent-yellow' },
    PERSONALIZATION: { label: 'Fake Personalization', color: 'accent-orange' },
}

// Pre-generated mock attacks by difficulty
function buildAttack(name, bank, difficulty) {
    const attacks = {
        easy: {
            sender_name: `${bank} Securty Team`,
            sender_email: `alert@${bank.toLowerCase().replace(/\s/g, '')}-logins.xyz`,
            subject: `URGENT!!! Your ${bank} account has been compromise`,
            body: `Dear Costumer,

We have detectd suspicious activty on your ${bank} acount. Your account will be permanentely locked if you do not verify your identtiy withing 2 hours.

Please click the button below to confirm your identity and prevent unauthorized access to your funds.

If you do not respond, your account balance of ₹2,47,893 will be frozen immediately.

Thank you,
${bank} Security Deparment`,
            cta_text: 'VERIFY NOW >>>',
            red_flags: [
                {
                    id: 'flag_1',
                    type: 'GRAMMAR',
                    location: 'body',
                    description: 'Multiple spelling errors: "Costumer", "detectd", "activty", "acount", "permanentely", "identtiy", "withing"',
                    quote: 'detectd suspicious activty on your acount',
                },
                {
                    id: 'flag_2',
                    type: 'SENDER_DOMAIN',
                    location: 'sender',
                    description: `The domain "${bank.toLowerCase().replace(/\s/g, '')}-logins.xyz" is not a legitimate bank domain. Real banks use official .com or .co.in domains.`,
                    quote: `${bank.toLowerCase().replace(/\s/g, '')}-logins.xyz`,
                },
                {
                    id: 'flag_3',
                    type: 'URGENCY',
                    location: 'subject',
                    description: 'URGENT!!! with multiple exclamation marks and a tight 2-hour deadline are classic pressure tactics.',
                    quote: 'URGENT!!! ... withing 2 hours',
                },
                {
                    id: 'flag_4',
                    type: 'GENERIC_GREETING',
                    location: 'body',
                    description: `Uses "Dear Costumer" instead of your actual name, despite supposedly knowing your account details.`,
                    quote: 'Dear Costumer',
                },
                {
                    id: 'flag_5',
                    type: 'REQUEST_TYPE',
                    location: 'body',
                    description: 'Asks you to click a link to "verify identity" — legitimate banks never ask for credentials via email.',
                    quote: 'click the button below to confirm your identity',
                },
            ],
        },
        medium: {
            sender_name: `${bank} Security Alert`,
            sender_email: `no-reply@${bank.toLowerCase().replace(/\s/g, '')}-alerts.co.in`,
            subject: `Security Alert: Unusual login attempt on your ${bank} account`,
            body: `Dear ${name},

Our security system detected a login attempt from an unrecognized device on your ${bank} account at 14:32 IST today.

Device: iPhone 15 Pro
Location: Mumbai, Maharashtra
IP Address: 103.21.58.${Math.floor(Math.random() * 255)}

If this was you, no action is needed. If you did not initiate this login, please verify your account immediately to prevent unauthorized access.

For your protection, we've temporarily limited certain account features until verification is complete.

Best regards,
${bank} Digital Security Team
Ref: #SEC-${Date.now().toString().slice(-6)}`,
            cta_text: 'Verify My Account',
            red_flags: [
                {
                    id: 'flag_1',
                    type: 'SENDER_DOMAIN',
                    location: 'sender',
                    description: `The domain "${bank.toLowerCase().replace(/\s/g, '')}-alerts.co.in" looks official but is not the real bank domain — note the added "-alerts" subdomain.`,
                    quote: `${bank.toLowerCase().replace(/\s/g, '')}-alerts.co.in`,
                },
                {
                    id: 'flag_2',
                    type: 'URGENCY',
                    location: 'body',
                    description: 'Creates urgency with "temporarily limited certain account features" — pressuring you to act quickly.',
                    quote: 'temporarily limited certain account features until verification is complete',
                },
                {
                    id: 'flag_3',
                    type: 'LINK_MISMATCH',
                    location: 'cta',
                    description: 'The "Verify My Account" button links to an external site, not the official bank portal.',
                    quote: 'Verify My Account',
                },
                {
                    id: 'flag_4',
                    type: 'PERSONALIZATION',
                    location: 'body',
                    description: 'Uses specific device and location details to appear legitimate, but these can be fabricated or guessed.',
                    quote: 'iPhone 15 Pro, Mumbai, Maharashtra',
                },
                {
                    id: 'flag_5',
                    type: 'REQUEST_TYPE',
                    location: 'body',
                    description: 'Asks you to "verify your account" via a link — banks would direct you to log in through the official app or website.',
                    quote: 'please verify your account immediately',
                },
            ],
        },
        hard: {
            sender_name: `${bank} - Account Security`,
            sender_email: `security@${bank.toLowerCase().replace(/\s/g, '').slice(0, -1)}.co.in`,
            subject: `Transaction Alert: ₹49,999 debited from your account`,
            body: `Dear ${name},

A transaction of ₹49,999.00 has been processed from your ${bank} account ending in **4521.

Transaction Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Amount:      ₹49,999.00
Merchant:    Amazon Pay India
Date & Time: ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
Reference:   TXN${Date.now().toString().slice(-8)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you authorized this transaction, no action is required.

If you did not authorize this transaction, please report it within 24 hours to initiate a reversal. You may verify and dispute this transaction through our secure portal.

This is an automated alert from ${bank} Digital Banking. Please do not reply to this email.

For customer support: 1800-XXX-XXXX (24/7)
${bank} | RBI Regulated | DICGC Insured up to ₹5,00,000`,
            cta_text: 'Report Unauthorized Transaction',
            red_flags: [
                {
                    id: 'flag_1',
                    type: 'SENDER_DOMAIN',
                    location: 'sender',
                    description: `The sender domain is missing one letter from the real bank name — a classic typosquat that's easy to miss at a glance.`,
                    quote: `${bank.toLowerCase().replace(/\s/g, '').slice(0, -1)}.co.in`,
                },
                {
                    id: 'flag_2',
                    type: 'REQUEST_TYPE',
                    location: 'cta',
                    description: 'Asks you to click a link to "report" the transaction instead of directing you to the official mobile app or branch.',
                    quote: 'Report Unauthorized Transaction',
                },
                {
                    id: 'flag_3',
                    type: 'URGENCY',
                    location: 'body',
                    description: 'The 24-hour deadline to "initiate a reversal" creates fear of financial loss, pressuring hasty action.',
                    quote: 'report it within 24 hours to initiate a reversal',
                },
                {
                    id: 'flag_4',
                    type: 'PERSONALIZATION',
                    location: 'body',
                    description: 'Uses a specific and plausible transaction amount (₹49,999) and merchant (Amazon Pay) to trigger realistic concern.',
                    quote: '₹49,999.00 ... Amazon Pay India',
                },
                {
                    id: 'flag_5',
                    type: 'LINK_MISMATCH',
                    location: 'body',
                    description: '"Secure portal" link would point to a phishing domain, not the actual bank website.',
                    quote: 'verify and dispute this transaction through our secure portal',
                },
                {
                    id: 'flag_6',
                    type: 'LOGO',
                    location: 'body',
                    description: 'Footer mimics official bank formatting with RBI and DICGC references to establish false legitimacy.',
                    quote: 'RBI Regulated | DICGC Insured',
                },
            ],
        },
    }

    return { ...attacks[difficulty], difficulty, attack_type: 'email' }
}

export function generateMockAttack(name, bank, role, difficulty) {
    return buildAttack(name || 'User', bank || 'State Bank of India', difficulty || 'medium')
}

export function scoreMockAttempt(attack, userFlagIds) {
    const actualFlags = attack.red_flags || []
    const flaggedSet = new Set(userFlagIds)

    const feedback = actualFlags.map((flag) => ({
        flag_id: flag.id,
        caught: flaggedSet.has(flag.id),
        type: flag.type,
        description: flag.description,
        quote: flag.quote,
    }))

    const caught = feedback.filter((f) => f.caught).length
    const total = actualFlags.length

    let scoreDelta = 0
    const ratio = caught / Math.max(total, 1)
    if (ratio >= 0.8) scoreDelta = 12
    else if (ratio >= 0.6) scoreDelta = 8
    else if (ratio >= 0.4) scoreDelta = 4

    return {
        caught,
        missed: total - caught,
        total_flags: total,
        feedback,
        score_delta: scoreDelta,
        percentage: Math.round(ratio * 100),
        overall_tip: caught === total
            ? 'Perfect score! You spotted every red flag. Your awareness is excellent.'
            : caught >= total * 0.6
                ? `Good effort! You caught ${caught} of ${total} flags. Pay extra attention to sender domains and subtle urgency cues.`
                : `Keep practicing. Phishing attacks are designed to fool everyone — the more you train, the sharper you get.`,
    }
}
