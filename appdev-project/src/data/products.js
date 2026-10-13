export const PRODUCTS = [
  {
    id: 'rice-plain',
    name: 'Rice (Plain)',
    priceCents: 1500,
    category: 'Rice'
  },
  {
    id: 'chicken-1pc',
    name: 'Fried Chicken (1 pc)',
    priceCents: 6500,
    category: 'Viand'
  },
  {
    id: 'pork-adobo',
    name: 'Pork Adobo',
    priceCents: 6000,
    category: 'Viand'
  },
  {
    id: 'veggie-side',
    name: 'Vegetable Side Dish',
    priceCents: 3500,
    category: 'Side'
  },
  {
    id: 'iced-tea',
    name: 'Iced Tea (cup)',
    priceCents: 2000,
    category: 'Drink'
  },
  {
    id: 'bottled-water',
    name: 'Bottled Water',
    priceCents: 2000,
    category: 'Drink'
  }
]

export const PRODUCT_MAP = Object.freeze(
  PRODUCTS.reduce((map, product) => {
    map[product.id] = product
    return map
  }, {})
)
