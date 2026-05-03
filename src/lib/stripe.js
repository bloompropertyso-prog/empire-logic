import { loadStripe } from '@stripe/stripe-js'

// Singleton — only loads once
let stripePromise = null

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

/**
 * Kick off a Stripe Checkout session.
 * Calls your /api/create-checkout-session Vercel serverless function.
 */
export async function redirectToCheckout({ priceId, userId, userEmail }) {
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId, userId, userEmail }),
  })

  const { sessionId, error } = await res.json()
  if (error) throw new Error(error)

  const stripe = await getStripe()
  const { error: stripeError } = await stripe.redirectToCheckout({ sessionId })
  if (stripeError) throw new Error(stripeError.message)
}

/**
 * Open Stripe Customer Portal (manage billing / cancel).
 */
export async function redirectToPortal({ customerId }) {
  const res = await fetch('/api/create-portal-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId }),
  })

  const { url, error } = await res.json()
  if (error) throw new Error(error)
  window.location.href = url
}
