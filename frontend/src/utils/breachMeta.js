// Breach metadata catalog — rendering data for breach check results

export const SEVERITY_META = {
    HIGH: {
        color: 'accent-red',
        bg: 'bg-accent-red/15',
        border: 'border-l-accent-red',
        label: 'Critical',
    },
    MEDIUM: {
        color: 'accent-orange',
        bg: 'bg-accent-orange/15',
        border: 'border-l-accent-orange',
        label: 'Moderate',
    },
    LOW: {
        color: 'accent-yellow',
        bg: 'bg-accent-yellow/15',
        border: 'border-l-accent-yellow',
        label: 'Minor',
    },
}

export const DATA_TYPE_COLORS = {
    email: 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/30',
    password: 'bg-accent-red/15 text-accent-red border-accent-red/30',
    phone: 'bg-accent-orange/15 text-accent-orange border-accent-orange/30',
    ip_address: 'bg-accent-purple/15 text-accent-purple border-accent-purple/30',
    name: 'bg-accent-green/15 text-accent-green border-accent-green/30',
    dob: 'bg-accent-yellow/15 text-accent-yellow border-accent-yellow/30',
    address: 'bg-accent-orange/15 text-accent-orange border-accent-orange/30',
    credit_card: 'bg-accent-red/15 text-accent-red border-accent-red/30',
    username: 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/30',
}

export const MOCK_BREACHES = [
    {
        id: 1,
        name: 'LinkedIn',
        domain: 'linkedin.com',
        year: 2021,
        date: '2021-06-22',
        recordCount: 700000000,
        severity: 'HIGH',
        dataTypes: ['email', 'name', 'phone', 'username'],
        description:
            'In June 2021, a massive LinkedIn data scraping incident exposed profile data of 700 million users — nearly 93% of all LinkedIn members. Scraped data included email addresses, phone numbers, geolocation records, and professional details.',
    },
    {
        id: 2,
        name: 'Adobe',
        domain: 'adobe.com',
        year: 2013,
        date: '2013-10-04',
        recordCount: 153000000,
        severity: 'HIGH',
        dataTypes: ['email', 'password', 'username', 'credit_card'],
        description:
            'In October 2013, Adobe suffered a massive breach exposing 153 million user records. Encrypted passwords, credit card information, and login credentials were compromised. The weak encryption was later cracked, exposing millions of plaintext passwords.',
    },
    {
        id: 3,
        name: 'Canva',
        domain: 'canva.com',
        year: 2019,
        date: '2019-05-24',
        recordCount: 137000000,
        severity: 'MEDIUM',
        dataTypes: ['email', 'name', 'username'],
        description:
            'In May 2019, the graphic design tool Canva suffered a breach that exposed 137 million user accounts. The breach included usernames, email addresses, and bcrypt-hashed passwords. Canva prompted all users to change their passwords immediately.',
    },
]

export const MOCK_RECOMMENDATIONS = [
    {
        id: 1,
        text: 'Change your LinkedIn password immediately and enable two-factor authentication (2FA).',
    },
    {
        id: 2,
        text: 'Update your Adobe account password. If you reused this password elsewhere, change those accounts too.',
    },
    {
        id: 3,
        text: 'Check your Canva account for unauthorized activity and revoke any connected third-party apps.',
    },
    {
        id: 4,
        text: 'Use a password manager to generate unique 16+ character passwords for every account.',
    },
    {
        id: 5,
        text: 'Enable login alerts and suspicious activity notifications on all breached services.',
    },
    {
        id: 6,
        text: 'Consider freezing your credit if financial data (credit card) was exposed in the Adobe breach.',
    },
]

export const COMMON_PASSWORDS = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 'password1',
    'iloveyou', '1234567', 'sunshine', 'princess', 'admin', 'welcome',
    'monkey', 'dragon', 'master', 'login', 'letmein', '12345678',
    'football', 'shadow', 'passw0rd', 'trustno1',
]
