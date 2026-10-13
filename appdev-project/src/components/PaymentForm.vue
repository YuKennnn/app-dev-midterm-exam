<script setup>
import { storeToRefs } from 'pinia'
import { usePosStore } from '../stores/pos.js'

const posStore = usePosStore()
const {
  cashInput,
  validationError,
  isCartEmpty,
  isCompleted
} = storeToRefs(posStore)

const {
  setCashInput,
  confirmPayment
} = posStore

function onInput(event) {
  setCashInput(event.target.value)
}

function onSubmit() {
  confirmPayment()
}
</script>

<template>
  <section class="card payment-panel" aria-labelledby="payment-heading">
    <h2 id="payment-heading" class="payment-title">Payment</h2>

    <form class="payment-form" @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="cash-tendered-input" class="input-label">
          Cash Tendered (₱)
        </label>
        <div class="input-wrapper">
          <span class="currency-symbol" aria-hidden="true">₱</span>
          <input
            id="cash-tendered-input"
            type="number"
            min="0"
            step="0.01"
            class="input-control cash-input"
            placeholder="0.00"
            :value="cashInput"
            :disabled="isCompleted || isCartEmpty"
            :aria-invalid="!!validationError"
            :aria-describedby="validationError ? 'payment-error-msg' : undefined"
            required
            @input="onInput"
          />
        </div>
      </div>

      <!-- Validation Error Banner -->
      <div
        v-if="validationError"
        id="payment-error-msg"
        class="banner banner-danger"
        role="alert"
        aria-live="assertive"
      >
        <span class="error-icon" aria-hidden="true">⚠️</span>
        <span class="error-text">{{ validationError }}</span>
      </div>

      <button
        type="submit"
        class="btn btn-primary submit-btn"
        :disabled="isCompleted || isCartEmpty"
      >
        <span>Confirm Payment</span>
      </button>
    </form>
  </section>
</template>

<style scoped>
.payment-panel {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  background: var(--color-card);
  gap: 1rem;
}

.payment-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-main);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 0.875rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-muted);
  pointer-events: none;
}

.cash-input {
  padding-left: 2rem;
  font-family: var(--font-mono);
  font-size: 1.125rem;
  font-weight: 600;
}

.error-icon {
  flex-shrink: 0;
}

.error-text {
  line-height: 1.35;
}

.submit-btn {
  width: 100%;
  font-size: 1rem;
}
</style>
