// High-fidelity Easypaisa payment transfer receipt SVG as Data URI
export const SAMPLE_EASYPAISA_RECEIPT = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="850" viewBox="0 0 600 850" fill="none">
  <defs>
    <linearGradient id="ep-header-grad" x1="0" y1="0" x2="600" y2="200" gradientUnits="userSpaceOnUse">
      <stop stop-color="#00A859"/>
      <stop offset="1" stop-color="#007F3E"/>
    </linearGradient>
    <filter id="shadow" x="0" y="0" width="600" height="850" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Background Card -->
  <rect width="600" height="850" rx="32" fill="#FFFFFF"/>
  
  <!-- Header Banner -->
  <rect width="600" height="220" rx="32" fill="url(#ep-header-grad)"/>
  <rect y="188" width="600" height="32" fill="url(#ep-header-grad)"/>

  <!-- Brand Title -->
  <circle cx="80" cy="80" r="32" fill="#FFFFFF" fill-opacity="0.2"/>
  <path d="M70 70 L90 70 L90 90 L70 90 Z" fill="#FFFFFF" fill-opacity="0.3"/>
  <text x="126" y="74" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="800" letter-spacing="1">easypaisa</text>
  <text x="126" y="98" fill="#D1FAE5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600">Verified Payment Slip • Telenor Microfinance Bank</text>
  
  <!-- Success Badge -->
  <circle cx="300" cy="220" r="44" fill="#FFFFFF" filter="url(#shadow)"/>
  <circle cx="300" cy="220" r="36" fill="#10B981"/>
  <path d="M288 220 L296 228 L312 212" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Transaction Details Body -->
  <text x="300" y="300" text-anchor="middle" fill="#047857" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700">Payment Successful</text>
  <text x="300" y="340" text-anchor="middle" fill="#111827" font-family="monospace, -apple-system" font-size="36" font-weight="800">Rs. 458,700</text>
  <text x="300" y="365" text-anchor="middle" fill="#6B7280" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13">Direct Merchant Easypaisa Settlement</text>

  <!-- Divider -->
  <line x1="60" y1="400" x2="540" y2="400" stroke="#E5E7EB" stroke-width="1.5" stroke-dasharray="6 6"/>

  <!-- Key Value Pairs -->
  <!-- TRX ID -->
  <text x="60" y="445" fill="#6B7280" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500">Transaction (TRX) ID</text>
  <text x="540" y="445" text-anchor="end" fill="#111827" font-family="monospace" font-size="16" font-weight="700">EP-8994726190</text>

  <!-- Date / Time -->
  <text x="60" y="490" fill="#6B7280" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500">Timestamp</text>
  <text x="540" y="490" text-anchor="end" fill="#111827" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600">19 Aug 2026, 02:40 PM</text>

  <!-- Sent To -->
  <text x="60" y="535" fill="#6B7280" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500">Receiver Account</text>
  <text x="540" y="535" text-anchor="end" fill="#047857" font-family="monospace" font-size="15" font-weight="700">+92 3150360126</text>

  <!-- Account Title -->
  <text x="60" y="580" fill="#6B7280" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500">Receiver Title</text>
  <text x="540" y="580" text-anchor="end" fill="#111827" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700">LUNOVA Luxury Lighting Ltd</text>

  <!-- Sender Name -->
  <text x="60" y="625" fill="#6B7280" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500">Transferred By</text>
  <text x="540" y="625" text-anchor="end" fill="#111827" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600">Zayn Malik</text>

  <!-- Sender Number -->
  <text x="60" y="670" fill="#6B7280" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500">Sender Account</text>
  <text x="540" y="670" text-anchor="end" fill="#4B5563" font-family="monospace" font-size="14">0301-4478192</text>

  <!-- Order Reference Tag -->
  <rect x="60" y="715" width="480" height="52" rx="16" fill="#F3F4F6"/>
  <text x="80" y="746" fill="#374151" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600">Order Reference:</text>
  <text x="520" y="746" text-anchor="end" fill="#047857" font-family="monospace" font-size="14" font-weight="700">ORD-89417 (LUNOVA Atelier)</text>

  <!-- Footer Seal -->
  <text x="300" y="810" text-anchor="middle" fill="#9CA3AF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11">Digitally Authenticated by State Bank of Pakistan Sandbox Network</text>
</svg>
`)}`;
