<script setup>
import { storeToRefs } from 'pinia'
import { PRODUCTS } from '../data/products.js'
import { centsToPesos } from '../utils/money.js'
import { usePosStore } from '../stores/pos.js'

const posStore = usePosStore()
const { isCompleted } = storeToRefs(posStore)
const { addItem } = posStore
</script>

<template>
  <section class="products-section" aria-labelledby="products-heading">
    <div class="section-header">
      <h2 id="products-heading" class="section-title">Cafeteria Menu</h2>
      <span class="product-count">{{ PRODUCTS.length }} items available</span>
    </div>

    <div class="product-grid" role="list">
      <article
        v-for="product in PRODUCTS"
        :key="product.id"
        class="card product-card"
        role="listitem"
      >
        <div class="product-info">
          <div class="product-header-row">
            <span class="status-pill status-pill-violet">{{ product.category }}</span>
            <span class="product-price">{{ centsToPesos(product.priceCents) }}</span>
          </div>
          <h3 class="product-name">{{ product.name }}</h3>
        </div>

        <button
          type="button"
          class="btn btn-primary add-btn"
          :disabled="isCompleted"
          :aria-label="`Add ${product.name} to order`"
          @click="addItem(product.id)"
        >
          <span aria-hidden="true">+</span>
          <span>Add to Order</span>
        </button>
      </article>
    </div>
  </section>
</template>

<style scoped>
.products-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-main);
}

.product-count {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.product-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.125rem;
  gap: 1rem;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-border-hover);
}

.product-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.product-name {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--color-text-main);
  line-height: 1.35;
}

.product-price {
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary);
}

.add-btn {
  width: 100%;
}
</style>
