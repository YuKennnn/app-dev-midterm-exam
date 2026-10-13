# Campus Cafeteria POS (IT 415 Practical Examination)

## 1. Project Purpose & Scenario
This project is an individual practical examination application for **IT 415**:
- **Chosen Scenario**: Scenario 1 — Campus Cafeteria POS
- **Context**: A walk-up cafeteria counter where student assistants take orders for rice meals, viands, side dishes, and drinks using a desktop/laptop cashier workstation with a keyboard and mouse.
- **Goal**: Provide a fast, accessible single-screen cashier interface with accurate integer centavo calculations, strict cash payment validation, immutable receipt snapshotting, and transaction reset.

---

## 2. Technology Stack
- **Framework**: Vue 3 (Composition API with plain `<script setup>`, no TypeScript)
- **State Management**: Pinia (Setup Store pattern as single source of truth)
- **Build Tool**: Vite (Vue JavaScript template)
- **Styling**: Vanilla CSS with predefined violet/slate design tokens (`tokens.css`, `base.css`, `components.css`)
- **Testing**: Node.js built-in test runner (`node --test`)
- **Zero Heavy Dependencies**: No TypeScript, no UI component libraries, no floating-point currency dependencies.

---

## 3. Product Catalog
The application strictly features the required six cafeteria products with prices stored as integer centavos to eliminate floating-point rounding errors:

| ID | Item Name | Category | Centavos | Display Price |
|---|---|---|---:|---:|
| `rice-plain` | Rice (Plain) | Rice | 1500 | ₱15.00 |
| `chicken-1pc` | Fried Chicken (1 pc) | Viand | 6500 | ₱65.00 |
| `pork-adobo` | Pork Adobo | Viand | 6000 | ₱60.00 |
| `veggie-side` | Vegetable Side Dish | Side | 3500 | ₱35.00 |
| `iced-tea` | Iced Tea (cup) | Drink | 2000 | ₱20.00 |
| `bottled-water` | Bottled Water | Drink | 2000 | ₱20.00 |

---

## 4. Key Features & Business Rules
1. **Interactive Menu Grid**: Visible "+ Add to Order" buttons for each item; adding an existing item increases its quantity.
2. **Order Summary & Quantity Bounds**:
   - Items, quantities, unit prices, and subtotals update reactively.
   - Decrement button is disabled when quantity is 1 (with a separate Remove button).
   - Informative empty cart state when no items are selected.
3. **Exact Centavo Arithmetic & Direct String Parsing**:
   - Currency strings are parsed directly into integer centavos without `parseFloat` or floating-point multiplication.
   - Nonnegative safe integers are enforced throughout (`Number.isSafeInteger`).
4. **Strict Cash Payment Validation**:
   - Form controls use labeled numeric `<input type="number" min="0" step="0.01">`.
   - Blank, non-numeric, or negative payment displays:
     > `"Please enter a valid payment amount."`
   - Insufficient payment displays:
     > `"Insufficient payment. Please enter at least ₱[formatted total]."`
   - Exact payment succeeds with ₱0.00 change.
   - Cart items and entered cash are preserved upon validation failure for cashier correction.
5. **Immutable Receipt Snapshot**:
   - Early guard against duplicate confirmation submissions.
   - Deep-cloned, frozen receipt snapshot with one-time generated transaction reference (`TXN-YYYYMMDD-XXXX`).
   - Prevents later cart mutations from altering the issued receipt.
6. **Transaction Reset**:
   - "Start New Transaction" button completely clears cart, cash input, errors, confirmation, and receipt.

---

## 5. Mandatory Worked Example

| Item | Qty | Unit Price | Subtotal |
|---|:---:|:---:|:---:|
| Fried Chicken (1 pc) | 2 | ₱65.00 | ₱130.00 |
| Rice (Plain) | 1 | ₱15.00 | ₱15.00 |
| Iced Tea (cup) | 1 | ₱20.00 | ₱20.00 |
| **Total** | | | **₱165.00** |
| **Cash Tendered** | | | **₱200.00** |
| **Change** | | | **₱35.00** |

---

## 6. Installation & Run Commands

### Prerequisites
- Node.js v22.18+ or >= v24.12 (Node 24 recommended)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in a modern browser.

### 3. Run Automated Tests
```bash
npm test
# or directly:
node --test tests/pos.test.js
```

### 4. Build for Production
```bash
npm run build
```

---

## 7. Verification & Test Suite Summary
The test suite in `tests/pos.test.js` covers 14 unit test assertions across 4 test suites:
- **Product Catalog Verification**: Validates 6 items, stable IDs, and centavo prices.
- **Money Calculations**: Verifies integer centavo formatting (`₱165.00`), direct decimal string parsing (`'165.50'` -> `16550`), and rejection of malformed or scientific-notation inputs.
- **Validation Rules**: Confirms exact error strings for blank, negative, and insufficient amounts (`₱100.00` tendered against `₱165.00` total).
- **Store & Lifecycle**: Verifies cart adjustments, boundary at quantity 1, the mandatory worked example, duplicate confirmation prevention, and clean transaction reset.

All 14 tests pass cleanly via `node --test`.

---

## 8. In-Memory Classroom Boundaries & Limitations
- In-memory simulation: Cart and transactions reside purely in browser memory during the active session.
- No database, user authentication, or multi-role permissions.
- No live payment gateways, QR code processing, or card terminals.
- No inventory stock tracking or administrative product management.

---

## 9. Examination Submission Evidence Guide

### Suggested Git Commits
The development followed three distinct milestones:
1. `feat: setup cafeteria pos layout and design tokens`
2. `feat: implement ordering actions and centavo calculations`
3. `feat: add payment validation, receipt snapshot, tests, and documentation`

### Required Submission Screenshots Checklist
Capture the following screenshots in the running application (`http://localhost:5173`):
- [ ] **1. Product List**: Displaying all 6 cafeteria menu cards with categories and prices.
- [ ] **2. Cart with Worked Example**: Cart populated with 2x Fried Chicken, 1x Rice, 1x Iced Tea, showing Total: ₱165.00.
- [ ] **3. Insufficient Payment Feedback**: Cash tendered input showing `100.00` with the warning banner: *"Insufficient payment. Please enter at least ₱165.00."*
- [ ] **4. Successful Payment & Change**: Cash tendered `200.00` with the green *"Payment Successful"* banner and Change: ₱35.00.
- [ ] **5. Official Receipt**: Receipt panel showing the unique reference number (`TXN-...`), timestamp, line items, and breakdown.
- [ ] **6. Git Commit History**: GitHub or terminal commit history showing the development progression.
