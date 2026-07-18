# F2K Square Integration Audit & Implementation Plan

**Date**: July 17, 2026
**Status**: In Progress
**Product Owner**: @dcplatforms

---

## Executive Summary

F2K currently has a functional farm-to-table ordering system without payment processing. This audit outlines the implementation of Square as the e-commerce payment engine to enable real transactions.

## Current State Analysis

### Existing Features ✅
- Product catalog with categories and pricing
- Shopping cart with add/remove/quantity management
- Order form collection (name, email, phone, delivery method/address)
- Order persistence to in-memory store
- Order status tracking (Pending → Preparing → Ready → Delivered)
- Admin dashboard for order management
- localStorage persistence for cart

### Missing Features ❌
- **Payment Processing** - No payment gateway integrated
- **Payment Method Collection** - No card/payment UI
- **Payment Authentication** - No tokenization or security
- **Transaction Recording** - Payments not stored or verified
- **Receipt/Confirmation** - No payment confirmation to customer
- **Refund Capability** - No refund processing
- **PCI Compliance** - No security certifications for payment handling

---

## Square Integration Architecture

### Frontend Components to Add/Modify

#### 1. **Web Payments SDK Integration**
- **File**: `index.html` (add script tag)
- **Change**: Load Square Web Payments SDK v1
  ```html
  <script async src="https://web.squarecdn.com/v1/square.js"></script>
  ```

#### 2. **New Component: SquarePaymentForm**
- **File**: `SquarePaymentForm.tsx` (create new)
- **Responsibilities**:
  - Initialize Web Payments SDK
  - Render payment input elements
  - Request payment tokens from Square
  - Handle payment errors/validation
- **Integration Point**: CartDrawer checkout flow

#### 3. **Modified: CartDrawer.tsx**
- **Change**: Add payment form component
- **Replace**: Basic order submission with payment flow
- **New Flow**:
  1. Collect customer details (name, email, phone, address)
  2. Display payment form (Square Web Payments)
  3. On submit: Request payment token from Square
  4. Send token + order details to `/api/process-payment` endpoint
  5. Backend processes payment via Square API
  6. On success: Create order record + clear cart
  7. Display order confirmation with receipt

#### 4. **Modified: App.tsx**
- **Change**: Update order state structure to include payment info
- **New Fields**:
  ```typescript
  payment: {
    status: 'pending' | 'processing' | 'completed' | 'failed';
    transactionId: string;
    method: string;
    last4: string;
  }
  ```

### Backend Endpoints to Add/Modify

#### 1. **New: POST /api/process-payment**
- **Purpose**: Process Square payment and create order
- **Request**:
  ```json
  {
    "sourceId": "string (Square payment token)",
    "customerName": "string",
    "customerEmail": "string",
    "customerPhone": "string",
    "deliveryMethod": "delivery|pickup",
    "address": "string (optional)",
    "items": [{ id, name, price, quantity, category }],
    "subtotal": number,
    "deliveryFee": number,
    "total": number
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "order": {
      "id": "string",
      "payment": {
        "transactionId": "string",
        "status": "completed",
        "method": "card",
        "last4": "1234"
      },
      "...other order fields..."
    }
  }
  ```
- **Implementation**:
  - Use Square Node.js SDK
  - Call `/v2/payments` API
  - Validate amount matches order total (security)
  - Create order only on successful payment
  - Idempotency: Use order ID as idempotency key
  - Error handling: Return meaningful error messages

#### 2. **Modified: POST /api/orders**
- **Change**: Deprecate or rename (keep for backward compatibility)
- **Alternative**: New endpoint handles both payment + order creation

### Configuration & Environment

#### 1. **Environment Variables Required**
```env
# Square API Keys
SQUARE_PRODUCTION_API_KEY=squ0_live_...
SQUARE_SANDBOX_API_KEY=squ0_test_...
SQUARE_LOCATION_ID=...
SQUARE_ENVIRONMENT=production|sandbox

# Frontend Configuration (exposed safely)
VITE_SQUARE_APPLICATION_ID=...
VITE_SQUARE_ENVIRONMENT=production|sandbox
VITE_SQUARE_LOCATION_ID=...
```

#### 2. **.env.local Setup**
```bash
# .env.local
VITE_SQUARE_APPLICATION_ID=your_app_id
VITE_SQUARE_ENVIRONMENT=sandbox
VITE_SQUARE_LOCATION_ID=your_location_id
SQUARE_PRODUCTION_API_KEY=your_api_key
SQUARE_SANDBOX_API_KEY=your_sandbox_key
SQUARE_LOCATION_ID=your_location_id
SQUARE_ENVIRONMENT=sandbox
```

### Dependencies to Add

**package.json**:
```json
{
  "dependencies": {
    "square": "^44.0.0"
  }
}
```

---

## Implementation Phases

### Phase 1: Frontend Preparation (Immediate)
1. Add Square Web Payments SDK to index.html
2. Create SquarePaymentForm.tsx component
3. Update CartDrawer to integrate payment form
4. Add Square configuration to vite.config.ts
5. Add environment variables to .env.example

### Phase 2: Backend Implementation (Immediate)
1. Install square npm package: `npm install square`
2. Create `/api/process-payment` endpoint in server.ts
3. Integrate Square Payments API client
4. Implement payment processing logic
5. Add error handling and validation
6. Add transaction logging/auditing

### Phase 3: Testing & Validation (Immediate)
1. Test with Square Sandbox credentials
2. Verify payment token generation
3. Test successful payment flow
4. Test error scenarios (declined cards, network errors)
5. Verify order creation on payment success
6. Test cart clearing on successful payment

### Phase 4: Deployment (Post-Testing)
1. Update CONTRIBUTING.md with payment setup
2. Update DEVELOPMENT.md with Square configuration
3. Add secrets management documentation
4. Prepare production API keys (separate from sandbox)
5. Deploy to GitHub Pages with Netlify backend
6. Monitor transactions in Square Dashboard

---

## Security Considerations

### PCI Compliance
- ✅ Use Web Payments SDK (tokenization - PCI compliant)
- ✅ Never send card data to server (Square handles it)
- ✅ HTTPS only in production
- ✅ Validate amounts server-side (prevent tampering)

### API Key Management
- ✅ API keys in `.env` files (never committed)
- ✅ Separate sandbox/production keys
- ✅ Use GitHub Secrets for CI/CD
- ✅ Rotate keys periodically

### Idempotency
- ✅ Use order ID as idempotency key
- ✅ Prevent duplicate charges on network retry
- ✅ Return same response for duplicate requests

### Amount Validation
- ✅ Validate total on backend (prevent client-side tampering)
- ✅ Recalculate subtotal + delivery from scratch
- ✅ Log discrepancies for fraud detection

---

## Testing Checklist

### Unit Tests
- [ ] Payment amount calculation
- [ ] Delivery fee logic
- [ ] Payment token validation
- [ ] Error message formatting

### Integration Tests
- [ ] Sandbox payment processing
- [ ] Successful order creation post-payment
- [ ] Cart clearing on payment success
- [ ] Error recovery and retry logic

### E2E Tests
- [ ] Customer can add items to cart
- [ ] Customer can open checkout
- [ ] Payment form renders correctly
- [ ] Customer can enter payment info
- [ ] Payment processing completes
- [ ] Order appears in admin dashboard
- [ ] Order confirmation email sent
- [ ] Cart is cleared after payment

### Manual Sandbox Testing
- [ ] Test with Square test card numbers:
  - Visa: 4111111111111111
  - Mastercard: 5105105105105100
  - Amex: 2223003122003222
- [ ] Test declined card: 4000002500003155
- [ ] Test various CVV/expiry combinations

---

## Success Metrics

- ✅ Orders can be placed with payment
- ✅ Payments appear in Square Dashboard
- ✅ Order confirmation emails sent
- ✅ Admin dashboard shows payment status
- ✅ Cart clears after successful payment
- ✅ Error messages are helpful to users
- ✅ No duplicate charges on retry
- ✅ All Square test card scenarios work

---

## Future Enhancements

1. **Multiple Payment Methods**
   - Apple Pay / Google Pay
   - Digital wallets (PayPal, Venmo)

2. **Customer Portal**
   - View order history with payment details
   - Download receipts/invoices
   - Reorder functionality

3. **Recurring Orders**
   - Subscription/subscription box service
   - Auto-renewing deliveries
   - Square recurring payment API

4. **Analytics**
   - Revenue tracking
   - Payment success rate
   - Average order value
   - Popular products

5. **Fulfillment Integration**
   - Send order to Square Fulfillment API
   - Automated inventory management
   - Pickup notifications via Square

---

## References

- [Square Web Payments SDK Docs](https://developer.squareup.com/reference/sdks/web/payments)
- [Square Payments API](https://developer.squareup.com/reference/square/payments-api)
- [Square Node.js SDK](https://github.com/square/square-nodejs-sdk)
- [PCI DSS Compliance](https://developer.squareup.com/reference/square_web_payments_sdk)
- [Square Sandbox Testing](https://developer.squareup.com/docs/devtools/sandbox)

---

## Sign-Off

**Product Owner**: @dcplatforms
**Reviewed**: July 17, 2026
**Ready for Implementation**: ✅ YES

