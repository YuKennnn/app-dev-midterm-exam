<script setup>
import { storeToRefs } from 'pinia'
import ProductList from './components/ProductList.vue'
import CartSummary from './components/CartSummary.vue'
import PaymentForm from './components/PaymentForm.vue'
import ReceiptPanel from './components/ReceiptPanel.vue'
import { usePosStore } from './stores/pos.js'

const posStore = usePosStore()
const { isCompleted } = storeToRefs(posStore)
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="header-container">
        <div class="brand-group">
          <span class="brand-logo" aria-hidden="true">🍱</span>
          <div class="brand-text">
            <h1 class="brand-title">Campus Cafeteria POS</h1>
            <p class="brand-subtitle">Walk-Up Counter Cashier System</p>
          </div>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="pos-grid">
        <!-- Left column: Cafeteria menu -->
        <section class="menu-column" aria-label="Cafeteria Menu Column">
          <ProductList />
        </section>

        <!-- Right column: Cart, Payment, and Receipt -->
        <aside class="checkout-column" aria-label="Checkout and Receipt Column">
          <!-- Active order workflow -->
          <template v-if="!isCompleted">
            <CartSummary />
            <PaymentForm />
          </template>

          <!-- Completed order receipt view -->
          <template v-else>
            <ReceiptPanel />
          </template>
        </aside>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: var(--color-card);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-container {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0.875rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-logo {
  font-size: 1.875rem;
}

.brand-title {
  font-family: var(--font-brand);
  font-size: 1.5rem;
  color: var(--color-primary);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.brand-subtitle {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.main-content {
  flex: 1;
  max-width: 1320px;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem;
}

.pos-grid {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 1.5rem;
  align-items: start;
}

.menu-column {
  min-width: 0;
}

.checkout-column {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: sticky;
  top: 5rem;
}

@media (max-width: 960px) {
  .pos-grid {
    grid-template-columns: 1fr;
  }

  .checkout-column {
    position: static;
  }
}
</style>
