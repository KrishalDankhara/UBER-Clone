# 🧪 Payment Integration - Testing Guide

## 📋 **Pre-Testing Setup**

### **1. Update Your Environment Variables**

Replace the placeholder values in your `.env` files with real test credentials:

**Backend (.env):**
```env
# Get these from your Razorpay Dashboard > Settings > API Keys
RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_KEY_SECRET

# Your other environment variables
DB_CONNECT=mongodb://localhost:27017/uber-clone
JWT_SECRET=your-secret-key
PORT=4000
```

**Frontend (.env):**
```env
VITE_BASE_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
```

### **2. Start Your Servers**

```bash
# Terminal 1 - Backend
cd Uber/Backend
npm start

# Terminal 2 - Frontend  
cd Uber/Frontend
npm run dev
```

---

## 🔧 **Step-by-Step Testing Process**

### **Step 1: Create Test Accounts**

1. **Create a User Account:**
   - Go to `http://localhost:5173/signup`
   - Register with test details
   - Login with your credentials

2. **Create a Captain Account:**
   - Go to `http://localhost:5173/captain-signup`
   - Register a test driver
   - Login to captain panel

### **Step 2: Complete a Test Ride**

1. **Book a Ride (User Side):**
   - Login as user
   - Enter pickup: "Mumbai Central Station"
   - Enter destination: "Bandra West Station"
   - Select vehicle type
   - Confirm ride

2. **Accept Ride (Captain Side):**
   - Login as captain in another browser/incognito
   - Accept the incoming ride request
   - Start the ride with OTP

3. **Complete Ride:**
   - End the ride from captain side
   - Ride status should be "completed"

### **Step 3: Test Payment Flow**

1. **Navigate to Payment:**
   - On user side, you'll be redirected to riding page
   - Click "Make a Payment" button
   - Payment modal should open

2. **Test Payment Scenarios:**

   **✅ Successful Payment:**
   - Use Razorpay test card: `4111 1111 1111 1111`
   - CVV: Any 3 digits (e.g., 123)
   - Expiry: Any future date (e.g., 12/25)
   - Complete payment
   - Should see success message

   **❌ Failed Payment:**
   - Use failing test card: `4000 0000 0000 0002`
   - Should handle failure gracefully

---

## 🧪 **Test Cases to Verify**

### **API Testing (Use Postman or cURL)**

#### **1. Create Payment Order:**
```bash
curl -X POST http://localhost:4000/payments/create-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"rideId": "YOUR_RIDE_ID"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Payment order created successfully",
  "data": {
    "orderId": "order_xxxxx",
    "amount": 19320,
    "currency": "INR",
    "rideId": "xxx",
    "fare": 193.20
  }
}
```

#### **2. Test Payment Verification:**
```bash
curl -X POST http://localhost:4000/payments/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "orderId": "order_xxxxx",
    "paymentId": "pay_xxxxx",
    "signature": "signature_xxxxx",
    "rideId": "YOUR_RIDE_ID"
  }'
```

#### **3. Check Payment Status:**
```bash
curl -X GET http://localhost:4000/payments/status/YOUR_RIDE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🎯 **Test Scenarios & Expected Results**

### **Scenario 1: Normal Payment Flow**
1. **Action:** Complete ride and make payment
2. **Expected:** Payment success, ride updated with payment details
3. **Verify:** Check database for updated payment fields

### **Scenario 2: Payment Failure Handling**
1. **Action:** Use failing test card
2. **Expected:** Error message displayed, payment retry available
3. **Verify:** No payment ID saved in database

### **Scenario 3: Duplicate Payment Prevention**
1. **Action:** Try to pay for already paid ride
2. **Expected:** Error message "Payment already completed"
3. **Verify:** API returns 400 status

### **Scenario 4: Unauthorized Payment**
1. **Action:** Try to pay for someone else's ride
2. **Expected:** 403 Unauthorized error
3. **Verify:** Security validation working

---

## 🐛 **Common Issues & Solutions**

### **Issue 1: "Razorpay is not defined"**
**Solution:** Check internet connection, Razorpay script loading

### **Issue 2: "Invalid signature" error**
**Solution:** Verify RAZORPAY_KEY_SECRET in backend .env

### **Issue 3: Payment order creation fails**
**Solution:** Check ride status is "completed", user authorization

### **Issue 4: Frontend can't connect to backend**
**Solution:** Verify VITE_BASE_URL in frontend .env

---

## 📊 **Database Verification**

After successful payment, check your MongoDB:

```javascript
// In MongoDB Compass or CLI
db.rides.findOne({ _id: ObjectId("YOUR_RIDE_ID") })

// Should contain:
{
  paymentID: "pay_xxxxx",
  orderId: "order_xxxxx", 
  signature: "signature_xxxxx",
  status: "completed"
}
```

---

## 🎮 **Test Credit Cards (Razorpay Test Mode)**

| Card Number | Type | Expected Result |
|------------|------|-----------------|
| 4111 1111 1111 1111 | Visa | Success |
| 5555 5555 5555 4444 | Mastercard | Success |
| 4000 0000 0000 0002 | Visa | Decline |
| 4000 0000 0000 0069 | Visa | Expired Card |

**Additional Test Details:**
- **CVV:** Any 3 digits
- **Expiry:** Any future date
- **Name:** Any name
- **Amount:** Any amount will work

---

## ✅ **Success Checklist**

- [ ] Backend server running without errors
- [ ] Frontend server running without errors
- [ ] Razorpay test keys configured correctly
- [ ] User can complete a ride
- [ ] Payment modal opens correctly
- [ ] Test payment goes through successfully
- [ ] Payment verification works
- [ ] Database updates with payment details
- [ ] Error handling works for failed payments
- [ ] UI shows appropriate success/error messages

---

## 🚀 **Next Steps After Testing**

1. **Production Setup:**
   - Replace test keys with live keys
   - Add webhook handling
   - Implement proper error logging

2. **Additional Features:**
   - Payment history page
   - Refund functionality
   - Multiple payment methods

3. **Security Enhancements:**
   - Rate limiting on payment APIs
   - Enhanced fraud detection
   - Payment audit logs

---

## 📞 **Support & Debugging**

If you encounter issues:

1. **Check browser console** for JavaScript errors
2. **Check backend logs** for API errors
3. **Verify network requests** in browser DevTools
4. **Test API endpoints** directly with Postman
5. **Check Razorpay dashboard** for payment logs

**Common Log Locations:**
- Browser Console: F12 → Console
- Backend Logs: Terminal running backend server
- Network Tab: F12 → Network → Filter by Fetch/XHR