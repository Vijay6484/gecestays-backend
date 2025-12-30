# Instamojo Payment Gateway Setup

This document explains how to set up Instamojo payment gateway integration alongside PayU Money.

## Environment Variables Required

Add the following variables to your `.env` file in the `Backend` directory:

```env
# Instamojo Configuration
INSTAMOJO_API_KEY=your_instamojo_api_key_here
INSTAMOJO_AUTH_TOKEN=your_instamojo_auth_token_here
INSTAMOJO_BASE_URL=https://test.instamojo.com
# For production, use: https://www.instamojo.com
```

**Note:** These are the ONLY new environment variables you need to add. The existing PayU variables remain unchanged.

## How to Get Instamojo Credentials

1. Sign up at [Instamojo](https://www.instamojo.com/)
2. Go to Settings → API & Plugins
3. Generate API Key and Auth Token
4. Copy the credentials to your `.env` file

## API Endpoints

### Payment Initiation
- **Endpoint:** `POST /admin/bookings/payments/instamojo`
- **Request Body:** (Same as PayU)
  ```json
  {
    "amount": "1000.00",
    "firstname": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "booking_id": 123,
    "productinfo": "Booking for Property Name"
  }
  ```

- **Response:**
  ```json
  {
    "success": true,
    "message": "Payment initiated",
    "instamojo_url": "https://test.instamojo.com/payment/...",
    "payment_request_id": "abc123",
    "payment_data": {
      "payment_request_id": "abc123",
      "txnid": "INSTAMOJO-uuid"
    }
  }
  ```

### Webhook Handler
- **Endpoint:** `POST /admin/bookings/instamojo/webhook`
- Handles payment status updates from Instamojo

### Success Verification
- **Endpoint:** `GET /admin/bookings/success/verify/instamojo/:txnid`
- Verifies payment and redirects to frontend success page

## Frontend Integration

The frontend can switch between PayU and Instamojo by calling different endpoints:

```javascript
// For PayU
const response = await fetch('/admin/bookings/payments/payu', {
  method: 'POST',
  body: JSON.stringify(paymentPayload)
});

// For Instamojo
const response = await fetch('/admin/bookings/payments/instamojo', {
  method: 'POST',
  body: JSON.stringify(paymentPayload)
});
```

For Instamojo, redirect the user to `instamojo_url` from the response instead of creating a form.

## Differences from PayU

1. **Payment URL:** Instamojo returns a direct URL (`instamojo_url`) instead of form data
2. **Redirect:** User is redirected directly to Instamojo URL (no form submission needed)
3. **Verification:** Uses webhook + redirect URL verification
4. **Transaction ID Format:** Uses `INSTAMOJO-{uuid}` prefix

## Testing

- Use `INSTAMOJO_BASE_URL=https://test.instamojo.com` for testing
- Use test credentials from Instamojo test account
- For production, change to `https://www.instamojo.com`

