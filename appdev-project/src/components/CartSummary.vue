<script setup>
import { storeToRefs } from 'pinia'
import { centsToPesos } from '../utils/money.js'
import { usePosStore } from '../stores/pos.js'

const posStore = usePosStore()
const {
  cartWithSubtotals,
  itemCount,
  isCartEmpty,
  formattedTotal,
  isCompleted
} = storeToRefs(posStore)

const {
  increaseQuantity,
  decreaseQuantity,
  removeItem
} = posStore
</script>

<template>
  <section class="card cart-panel" aria-labelledby="cart-heading">
    <div class="cart-header">
      <h2 id="cart-heading" class="cart-title">Order Summary</h2>
      <span v-if="!isCartEmpty" class="status-pill status-pill-violet">
        {{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }}
      </span>
    </div>

    <!-- Empty cart state -->
    <div v-if="isCartEmpty" class="empty-cart-state" role="status">
      <div class="empty-cart-icon" aria-hidden="true">🛒</div>
      <p class="empty-cart-title">Order is empty</p>
      <p class="empty-cart-hint">Select items from the cafeteria menu on the left to start building an order.</p>
    </div>

    <!-- Active cart item list -->
    <div v-else class="cart-content">
      <ul class="cart-items-list" role="list">
        <li
          v-for="item in cartWithSubtotals"
          :key="item.productId"
          class="cart-item-row"
        >
          <div class="item-main">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-unit-price">{{ centsToPesos(item.unitPriceCents) }} each</span>
          </div>

          <div class="item-actions">
            <div class="qty-control" role="group" :aria-label="`Quantity for ${item.name}`">
              <button
                type="button"
                class="qty-btn"
                :disabled="isCompleted || item.quantity <= 1"
                :aria-label="`Decrease quantity of ${item.name}`"
                @click="decreaseQuantity(item.productId)"
              >
                −
              </button>
              <span class="qty-value" aria-live="polite" :aria-label="`Current quantity ${item.quantity}`">
                {{ item.quantity }}
              </span>
              <button
                type="button"
                class="qty-btn"
                :disabled="isCompleted"
                :aria-label="`Increase quantity of ${item.name}`"
                @click="increaseQuantity(item.productId)"
              >
                +
              </button>
            </div>

            <span class="item-subtotal">
              {{ centsToPesos(item.subtotalCents) }}
            </span>

            <button
              type="button"
              class="btn-danger-outline remove-btn"
              :disabled="isCompleted"
              :aria-label="`Remove ${item.name} from order`"
              @click="removeItem(item.productId)"
            >
              Remove
            </button>
          </div>
        </li>
      </ul>

      <div class="cart-footer">
        <div class="total-row">
          <span class="total-label">Total Amount:</span>
          <span class="total-amount">{{ formattedTotal }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cart-panel {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  background: var(--color-card);
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.cart-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-main);
}

.empty-cart-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  text-align: center;
  color: var(--color-text-muted);
}

.empty-cart-icon {
  font-size: 2.25rem;
  margin-bottom: 0.5rem;
}

.empty-cart-title {
  font-weight: 600;
  color: var(--color-text-main);
  margin-bottom: 0.25rem;
}

.empty-cart-hint {
  font-size: 0.875rem;
  max-width: 280px;
}

.cart-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.75rem;
}

.cart-items-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 280px;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.cart-item-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--color-bg-subtle);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.item-main {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
}

.item-name {
  font-weight: 600;
  font-size: 0.9375rem;
  color: var(--color-text-main);
}

.item-unit-price {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
}

.item-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.qty-control {
  display: inline-flex;
  align-items: center;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  overflow: hidden;
}

.qty-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-main);
  cursor: pointer;
  transition: background 0.15s ease;
}

.qty-btn:hover:not(:disabled) {
  background: var(--color-bg-muted);
  color: var(--color-primary);
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qty-value {
  min-width: 30px;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: var(--font-mono);
}

.item-subtotal {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.9375rem;
  color: var(--color-text-main);
}

.remove-btn {
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  min-height: 32px;
  border-radius: 6px;
}

.cart-footer {
  border-top: 2px solid var(--color-border);
  padding-top: 0.875rem;
}

.total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.total-label {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-main);
}

.total-amount {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}
</style>
