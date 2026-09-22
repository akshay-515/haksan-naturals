ALTER TABLE payments
    ADD COLUMN razorpay_order_id VARCHAR(255) UNIQUE;