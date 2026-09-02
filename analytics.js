// ========================================
// VERCEL WEB ANALYTICS
// ========================================

// Import the inject function from the local copy of @vercel/analytics
import { inject } from './vercel-analytics.js';

// Initialize Vercel Web Analytics
inject({
  mode: 'auto', // Automatically detects development vs production
  debug: false  // Set to true to enable console logging of analytics events
});

// Note: When deployed on Vercel, you also need to:
// 1. Enable Web Analytics in the Vercel Dashboard
// 2. The analytics will automatically start tracking once enabled
// 3. Data will appear in your dashboard within a few days

// Export for potential use in other modules
export { inject };
