import { parsePesosToCents, centsToPesosAmount } from './money.js'

/**
 * Validates cash payment against the order total.
 * Returns validation status and error messages conforming to AGENTS.md.
 *
 * @param {string|number} cashInput
 * @param {number} totalCents
 * @returns {{ valid: boolean, message?: string, paymentCents?: number, changeCents?: number }}
 */
export function validatePayment(cashInput, totalCents) {
  const paymentCents = parsePesosToCents(cashInput)

  if (paymentCents === null) {
    return {
      valid: false,
      message: 'Please enter a valid payment amount.'
    }
  }

  if (paymentCents < totalCents) {
    return {
      valid: false,
      message: `Insufficient payment. Please enter at least ₱${centsToPesosAmount(totalCents)}.`
    }
  }

  const changeCents = paymentCents - totalCents

  return {
    valid: true,
    paymentCents,
    changeCents
  }
}
