import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { PRODUCT_MAP } from '../data/products.js'
import { centsToPesos } from '../utils/money.js'
import { validatePayment } from '../utils/validation.js'

export const usePosStore = defineStore('pos', () => {
  // State
  const cart = ref([])
  const cashInput = ref('')
  const validationError = ref('')
  const isCompleted = ref(false)
  const receipt = ref(null)

  // Getters / Computed
  const cartWithSubtotals = computed(() =>
    cart.value.map(item => ({
      ...item,
      subtotalCents: item.unitPriceCents * item.quantity
    }))
  )

  const totalCents = computed(() =>
    cart.value.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0)
  )

  const itemCount = computed(() =>
    cart.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const isCartEmpty = computed(() => cart.value.length === 0)

  const formattedTotal = computed(() => centsToPesos(totalCents.value))

  // Actions
  function addItem(productId) {
    if (isCompleted.value) return

    const product = PRODUCT_MAP[productId]
    if (!product) return

    validationError.value = ''

    const existing = cart.value.find(item => item.productId === productId)
    if (existing) {
      if (Number.isSafeInteger(existing.quantity)) {
        existing.quantity += 1
      }
    } else {
      cart.value.push({
        productId: product.id,
        name: product.name,
        unitPriceCents: product.priceCents,
        quantity: 1
      })
    }
  }

  function increaseQuantity(productId) {
    if (isCompleted.value) return

    validationError.value = ''
    const item = cart.value.find(i => i.productId === productId)
    if (item && Number.isSafeInteger(item.quantity)) {
      item.quantity += 1
    }
  }

  function decreaseQuantity(productId) {
    if (isCompleted.value) return

    validationError.value = ''
    const item = cart.value.find(i => i.productId === productId)
    if (item && item.quantity > 1) {
      item.quantity -= 1
    }
  }

  function removeItem(productId) {
    if (isCompleted.value) return

    validationError.value = ''
    cart.value = cart.value.filter(i => i.productId !== productId)
  }

  function setCashInput(value) {
    if (isCompleted.value) return

    cashInput.value = value
    validationError.value = ''
  }

  function confirmPayment() {
    // 1. Guard against duplicate confirmation before any operations
    if (isCompleted.value) return

    // 2. Reject empty cart
    if (isCartEmpty.value) {
      validationError.value = 'Cart is empty. Please add items before checking out.'
      return
    }

    // 3. Validate current cash input against total
    const result = validatePayment(cashInput.value, totalCents.value)
    if (!result.valid) {
      validationError.value = result.message
      return
    }

    // 4. Generate unique transaction reference once
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const randomHex = Math.floor(Math.random() * 0xffff)
      .toString(16)
      .toUpperCase()
      .padStart(4, '0')
    const reference = `TXN-${year}${month}${day}-${randomHex}`

    // 5. Create immutable receipt snapshot with independent copies
    receipt.value = Object.freeze({
      reference,
      timestamp: now.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }),
      items: cart.value.map(item =>
        Object.freeze({
          productId: item.productId,
          name: item.name,
          unitPriceCents: item.unitPriceCents,
          quantity: item.quantity,
          subtotalCents: item.unitPriceCents * item.quantity
        })
      ),
      totalCents: totalCents.value,
      amountPaidCents: result.paymentCents,
      changeCents: result.changeCents
    })

    // 6. Mark transaction as completed and clear error
    isCompleted.value = true
    validationError.value = ''
  }

  function startNewTransaction() {
    // Explicit reset of reactive state for setup store
    cart.value = []
    cashInput.value = ''
    validationError.value = ''
    isCompleted.value = false
    receipt.value = null
  }

  return {
    // State
    cart,
    cashInput,
    validationError,
    isCompleted,
    receipt,

    // Getters
    cartWithSubtotals,
    totalCents,
    itemCount,
    isCartEmpty,
    formattedTotal,

    // Actions
    addItem,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    setCashInput,
    confirmPayment,
    startNewTransaction
  }
})
