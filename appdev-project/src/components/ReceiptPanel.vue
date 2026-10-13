<script setup>
import { storeToRefs } from 'pinia'
import { centsToPesos } from '../utils/money.js'
import { usePosStore } from '../stores/pos.js'

const posStore = usePosStore()
const { receipt, isCompleted } = storeToRefs(posStore)
const { startNewTransaction } = posStore
</script>

<template>
  <section
    v-if="isCompleted && receipt"
    class="card receipt-panel"
    aria-labelledby="receipt-heading"
  >
    <div class="receipt-status-banner banner banner-success" role="status">
      <span class="success-icon" aria-hidden="true">✓</span>
      <div>
        <p class="success-title">Payment Successful</p>
        <p class="success-subtitle">Transaction processed and receipt generated.</p>
      </div>
    </div>

    <div class="receipt-sheet">
      <div class="receipt-header">
        <h2 id="receipt-heading" class="receipt-title">Official Cafeteria Receipt</h2>
        <div class="receipt-meta">
          <div class="meta-row">
            <span class="meta-label">Reference:</span>
            <span class="meta-value ref-badge">{{ receipt.reference }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Date & Time:</span>
            <span class="meta-value">{{ receipt.timestamp }}</span>
          </div>
        </div>
      </div>

      <div class="receipt-divider" aria-hidden="true"></div>

      <div class="receipt-items-table">
        <div class="table-header">
          <span class="col-item">Item</span>
          <span class="col-qty">Qty</span>
          <span class="col-subtotal">Amount</span>
        </div>

        <ul class="items-list" role="list">
          <li
            v-for="item in receipt.items"
            :key="item.productId"
            class="receipt-item-row"
          >
            <div class="item-name-block">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-calc">@ {{ centsToPesos(item.unitPriceCents) }}</span>
            </div>
            <span class="item-qty">{{ item.quantity }}</span>
            <span class="item-subtotal">{{ centsToPesos(item.subtotalCents) }}</span>
          </li>
        </ul>
      </div>

      <div class="receipt-divider" aria-hidden="true"></div>

      <div class="receipt-totals">
        <div class="summary-line">
          <span>Total:</span>
          <span class="summary-value total-val">{{ centsToPesos(receipt.totalCents) }}</span>
        </div>
        <div class="summary-line">
          <span>Amount Paid:</span>
          <span class="summary-value">{{ centsToPesos(receipt.amountPaidCents) }}</span>
        </div>
        <div class="summary-line change-line">
          <span>Change:</span>
          <span class="summary-value change-val">{{ centsToPesos(receipt.changeCents) }}</span>
        </div>
      </div>
    </div>

    <button
      type="button"
      class="btn btn-primary new-txn-btn"
      @click="startNewTransaction"
    >
      <span>Start New Transaction</span>
    </button>
  </section>
</template>

<style scoped>
.receipt-panel {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  background: var(--color-card);
  gap: 1.25rem;
}

.receipt-status-banner {
  align-items: center;
}

.success-icon {
  font-size: 1.25rem;
  font-weight: 700;
}

.success-title {
  font-weight: 700;
  font-size: 0.9375rem;
}

.success-subtitle {
  font-size: 0.8125rem;
  opacity: 0.9;
}

.receipt-sheet {
  border: 1px dashed var(--color-violet-border);
  background: var(--color-violet-subtle);
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.receipt-header {
  text-align: center;
}

.receipt-title {
  font-family: var(--font-brand);
  font-size: 1.25rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.receipt-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ref-badge {
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--color-text-main);
  background: var(--color-card);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  border: 1px solid var(--color-border);
}

.receipt-divider {
  border-top: 1px dashed var(--color-border-hover);
  margin: 0.25rem 0;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 40px 90px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding-bottom: 0.375rem;
  border-bottom: 1px solid var(--color-border);
}

.items-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.5rem;
}

.receipt-item-row {
  display: grid;
  grid-template-columns: 1fr 40px 90px;
  align-items: baseline;
  font-size: 0.875rem;
}

.item-name-block {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-weight: 600;
  color: var(--color-text-main);
}

.item-calc {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
}

.col-qty,
.item-qty {
  text-align: center;
  font-family: var(--font-mono);
}

.col-subtotal,
.item-subtotal {
  text-align: right;
  font-family: var(--font-mono);
  font-weight: 600;
}

.receipt-totals {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  font-size: 0.9375rem;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-value {
  font-family: var(--font-mono);
  font-weight: 600;
}

.total-val {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-main);
}

.change-line {
  padding-top: 0.375rem;
  border-top: 1px solid var(--color-border);
  font-weight: 700;
  color: var(--color-success);
}

.change-val {
  font-size: 1.25rem;
}

.new-txn-btn {
  width: 100%;
}
</style>
