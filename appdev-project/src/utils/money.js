/**
 * Formats integer centavos to decimal string without currency symbol (e.g. 16500 -> "165.00").
 * @param {number} cents
 * @returns {string}
 */
export function centsToPesosAmount(cents) {
  if (!Number.isSafeInteger(cents) || cents < 0) {
    return '0.00'
  }
  const whole = Math.floor(cents / 100)
  const frac = cents % 100
  const fracStr = String(frac).padStart(2, '0')
  return `${whole.toLocaleString('en-US')}.${fracStr}`
}

/**
 * Formats integer centavos to Philippine Peso currency string (e.g. 16500 -> "₱165.00").
 * @param {number} cents
 * @returns {string}
 */
export function centsToPesos(cents) {
  return `₱${centsToPesosAmount(cents)}`
}

/**
 * Parses a decimal string directly into integer centavos without floating-point math.
 * Enforces nonnegative safe integers and at most two decimal digits.
 * Returns null if the input is blank, non-numeric, negative, malformed, or out of safe range.
 *
 * Example:
 * "165.50" -> 16550
 * "200"    -> 20000
 * "15.5"   -> 1550
 *
 * @param {string|number} input
 * @returns {number|null}
 */
export function parsePesosToCents(input) {
  if (input === null || input === undefined) {
    return null
  }
  const str = String(input).trim()
  if (!str) {
    return null
  }
  // Reject negative numbers, extra decimal points, signs, exponential notation, or trailing non-digits
  if (!/^\d+(\.\d{1,2})?$/.test(str)) {
    return null
  }

  const [wholePart, fracPart = ''] = str.split('.')
  const paddedFrac = fracPart.padEnd(2, '0')
  const centsStr = wholePart + paddedFrac
  const cents = Number(centsStr)

  if (!Number.isSafeInteger(cents) || cents < 0) {
    return null
  }

  return cents
}
