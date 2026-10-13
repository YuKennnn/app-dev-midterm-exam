import { test, describe, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { setActivePinia, createPinia } from 'pinia'
import { PRODUCTS, PRODUCT_MAP } from '../src/data/products.js'
import { centsToPesos, centsToPesosAmount, parsePesosToCents } from '../src/utils/money.js'
import { validatePayment } from '../src/utils/validation.js'
import { usePosStore } from '../src/stores/pos.js'

describe('1. Product Catalog Verification', () => {
  test('contains exactly the required 6 products with correct names and centavo prices', () => {
    assert.equal(PRODUCTS.length, 6)

    const expected = [
      { id: 'rice-plain', name: 'Rice (Plain)', priceCents: 1500 },
      { id: 'chicken-1pc', name: 'Fried Chicken (1 pc)', priceCents: 6500 },
      { id: 'pork-adobo', name: 'Pork Adobo', priceCents: 6000 },
      { id: 'veggie-side', name: 'Vegetable Side Dish', priceCents: 3500 },
      { id: 'iced-tea', name: 'Iced Tea (cup)', priceCents: 2000 },
      { id: 'bottled-water', name: 'Bottled Water', priceCents: 2000 }
    ]

    for (const exp of expected) {
      const prod = PRODUCT_MAP[exp.id]
      assert.ok(prod, `Product with id ${exp.id} should exist`)
      assert.equal(prod.name, exp.name)
      assert.equal(prod.priceCents, exp.priceCents)
    }
  })
})

describe('2. Money Calculation & Parsing Utilities', () => {
  test('formats integer centavos to Philippine Peso currency strings', () => {
    assert.equal(centsToPesos(1500), '₱15.00')
    assert.equal(centsToPesos(6500), '₱65.00')
    assert.equal(centsToPesos(16500), '₱165.00')
    assert.equal(centsToPesos(0), '₱0.00')
    assert.equal(centsToPesosAmount(16500), '165.00')
  })

  test('parses decimal cash strings directly without floating-point math', () => {
    assert.equal(parsePesosToCents('165.50'), 16550)
    assert.equal(parsePesosToCents('200'), 20000)
    assert.equal(parsePesosToCents('15.5'), 1550)
    assert.equal(parsePesosToCents('0.05'), 5)
    assert.equal(parsePesosToCents('0'), 0)
  })

  test('rejects blank, non-numeric, negative, exponential, and excess decimal inputs', () => {
    assert.equal(parsePesosToCents(''), null)
    assert.equal(parsePesosToCents('   '), null)
    assert.equal(parsePesosToCents('-50'), null)
    assert.equal(parsePesosToCents('100abc'), null)
    assert.equal(parsePesosToCents('1e5'), null)
    assert.equal(parsePesosToCents('50.123'), null) // More than 2 decimal places
    assert.equal(parsePesosToCents(null), null)
  })
})

describe('3. Payment Validation Rules', () => {
  test('rejects blank, non-numeric, and negative payment with exact error message', () => {
    const invalidInputs = ['', '   ', 'abc', '-20', '50.999', '100xyz']
    for (const input of invalidInputs) {
      const result = validatePayment(input, 16500)
      assert.equal(result.valid, false)
      assert.equal(result.message, 'Please enter a valid payment amount.')
    }
  })

  test('rejects insufficient payment with exact formatted message', () => {
    const result = validatePayment('100.00', 16500)
    assert.equal(result.valid, false)
    assert.equal(result.message, 'Insufficient payment. Please enter at least ₱165.00.')

    const result2 = validatePayment('164.99', 16500)
    assert.equal(result2.valid, false)
    assert.equal(result2.message, 'Insufficient payment. Please enter at least ₱165.00.')
  })

  test('accepts exact payment and calculates ₱0.00 change', () => {
    const result = validatePayment('165.00', 16500)
    assert.equal(result.valid, true)
    assert.equal(result.paymentCents, 16500)
    assert.equal(result.changeCents, 0)
  })

  test('accepts excess payment and calculates correct change', () => {
    const result = validatePayment('200.00', 16500)
    assert.equal(result.valid, true)
    assert.equal(result.paymentCents, 20000)
    assert.equal(result.changeCents, 3500) // ₱35.00
  })
})

describe('4. Pinia POS Store Operations & Transaction Lifecycle', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('adding items and adjusting quantities work correctly', () => {
    const store = usePosStore()

    // Add item
    store.addItem('chicken-1pc')
    assert.equal(store.cart.length, 1)
    assert.equal(store.cart[0].quantity, 1)
    assert.equal(store.totalCents, 6500)

    // Repeated add increments quantity
    store.addItem('chicken-1pc')
    assert.equal(store.cart.length, 1)
    assert.equal(store.cart[0].quantity, 2)
    assert.equal(store.totalCents, 13000)

    // Increase quantity
    store.increaseQuantity('chicken-1pc')
    assert.equal(store.cart[0].quantity, 3)

    // Decrease quantity
    store.decreaseQuantity('chicken-1pc')
    assert.equal(store.cart[0].quantity, 2)

    // Decrease at quantity 1 is disabled/bounded
    store.decreaseQuantity('chicken-1pc')
    assert.equal(store.cart[0].quantity, 1)
    store.decreaseQuantity('chicken-1pc')
    assert.equal(store.cart[0].quantity, 1) // Remains 1

    // Explicit remove
    store.removeItem('chicken-1pc')
    assert.equal(store.cart.length, 0)
    assert.equal(store.totalCents, 0)
    assert.equal(store.isCartEmpty, true)
  })

  test('blocks checkout on empty cart', () => {
    const store = usePosStore()
    store.setCashInput('200')
    store.confirmPayment()

    assert.equal(store.isCompleted, false)
    assert.ok(store.validationError.includes('Cart is empty'))
  })

  test('preserves cart and cash input upon validation failure', () => {
    const store = usePosStore()
    store.addItem('chicken-1pc')
    store.setCashInput('50') // Insufficient (total is ₱65.00)

    store.confirmPayment()

    assert.equal(store.isCompleted, false)
    assert.equal(store.cart.length, 1)
    assert.equal(store.cashInput, '50')
    assert.equal(store.validationError, 'Insufficient payment. Please enter at least ₱65.00.')
  })

  test('executes the mandatory worked example correctly', () => {
    const store = usePosStore()

    // 2 x Fried Chicken (1 pc) = ₱130.00
    store.addItem('chicken-1pc')
    store.addItem('chicken-1pc')

    // 1 x Rice (Plain) = ₱15.00
    store.addItem('rice-plain')

    // 1 x Iced Tea (cup) = ₱20.00
    store.addItem('iced-tea')

    // Verify subtotal / totals
    assert.equal(store.totalCents, 16500)
    assert.equal(store.formattedTotal, '₱165.00')
    assert.equal(store.itemCount, 4)

    // Cash = ₱200.00
    store.setCashInput('200.00')

    // Confirm Payment
    store.confirmPayment()

    assert.equal(store.isCompleted, true)
    assert.equal(store.validationError, '')
    assert.ok(store.receipt, 'Receipt should be generated')

    // Verify receipt breakdown
    assert.equal(store.receipt.totalCents, 16500)
    assert.equal(store.receipt.amountPaidCents, 20000)
    assert.equal(store.receipt.changeCents, 3500) // ₱35.00
    assert.equal(store.receipt.items.length, 3)
    assert.match(store.receipt.reference, /^TXN-\d{8}-[A-F0-9]{4}$/)
  })

  test('guards against duplicate confirmation and preserves receipt immutability', () => {
    const store = usePosStore()
    store.addItem('rice-plain')
    store.setCashInput('50')
    store.confirmPayment()

    const initialRef = store.receipt.reference
    const initialItems = [...store.receipt.items]

    // Attempt second confirm
    store.confirmPayment()
    assert.equal(store.receipt.reference, initialRef)

    // Attempt modifying cart after completion - must be blocked
    store.addItem('chicken-1pc')
    assert.equal(store.cart.length, 1) // Does not add chicken
    assert.equal(store.receipt.items.length, initialItems.length)
  })

  test('starts new transaction and completely resets all state', () => {
    const store = usePosStore()
    store.addItem('rice-plain')
    store.setCashInput('20')
    store.confirmPayment()

    assert.equal(store.isCompleted, true)
    assert.ok(store.receipt)

    // Start new transaction
    store.startNewTransaction()

    assert.equal(store.cart.length, 0)
    assert.equal(store.cashInput, '')
    assert.equal(store.validationError, '')
    assert.equal(store.isCompleted, false)
    assert.equal(store.receipt, null)
    assert.equal(store.totalCents, 0)
    assert.equal(store.isCartEmpty, true)
  })
})
