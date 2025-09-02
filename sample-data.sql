-- Sample Data for Admin Dashboard Testing
-- Run this in Supabase SQL Editor to populate the database

-- First, let's add some sample categories (if not already added)
INSERT INTO categories (name, slug, description, is_active, sort_order, product_count) VALUES
('Electronics', 'electronics', 'Electronic devices and gadgets', true, 1, 5),
('Clothing', 'clothing', 'Fashion and apparel', true, 2, 3),
('Home & Garden', 'home-garden', 'Home improvement and garden supplies', true, 3, 2)
ON CONFLICT (slug) DO UPDATE SET
  product_count = EXCLUDED.product_count;

-- Add sample products
INSERT INTO products (name, slug, description, short_description, base_price, sale_price, category_id, brand, sku, stock_quantity, is_active, is_featured, images, tags, views_count, sales_count, rating_average, rating_count) VALUES
('iPhone 15 Pro', 'iphone-15-pro', 'Latest iPhone with advanced camera system and titanium design', 'Premium smartphone with titanium build', 999.99, 899.99, 
 (SELECT id FROM categories WHERE slug = 'electronics'), 'Apple', 'APL-IPH15PRO', 25, true, true,
 ARRAY['https://example.com/iphone15-1.jpg', 'https://example.com/iphone15-2.jpg'], 
 ARRAY['smartphone', 'iphone', 'apple', 'mobile'], 150, 12, 4.8, 24),

('MacBook Air M3', 'macbook-air-m3', 'Ultra-thin laptop with M3 chip for incredible performance', 'Lightweight laptop with M3 chip', 1199.99, 1099.99,
 (SELECT id FROM categories WHERE slug = 'electronics'), 'Apple', 'APL-MBA-M3', 15, true, true,
 ARRAY['https://example.com/macbook-1.jpg', 'https://example.com/macbook-2.jpg'],
 ARRAY['laptop', 'macbook', 'apple', 'computer'], 89, 8, 4.9, 16),

('Samsung Galaxy S24', 'samsung-galaxy-s24', 'Premium Android smartphone with AI features', 'Android flagship with AI capabilities', 799.99, 749.99,
 (SELECT id FROM categories WHERE slug = 'electronics'), 'Samsung', 'SAM-GS24', 30, true, false,
 ARRAY['https://example.com/galaxy-s24-1.jpg'], 
 ARRAY['smartphone', 'android', 'samsung'], 67, 15, 4.6, 30),

('Nike Air Max 270', 'nike-air-max-270', 'Comfortable running shoes with max air cushioning', 'Premium running shoes', 129.99, 109.99,
 (SELECT id FROM categories WHERE slug = 'clothing'), 'Nike', 'NIKE-AM270', 50, true, true,
 ARRAY['https://example.com/nike-shoes-1.jpg'],
 ARRAY['shoes', 'nike', 'running', 'footwear'], 45, 22, 4.7, 18),

('Adidas Hoodie', 'adidas-hoodie', 'Comfortable cotton blend hoodie for everyday wear', 'Casual hoodie for daily comfort', 69.99, null,
 (SELECT id FROM categories WHERE slug = 'clothing'), 'Adidas', 'ADI-HOOD01', 75, true, false,
 ARRAY['https://example.com/adidas-hoodie-1.jpg'],
 ARRAY['hoodie', 'adidas', 'casual', 'clothing'], 23, 18, 4.5, 12),

('Garden Tools Set', 'garden-tools-set', 'Complete set of essential gardening tools', '5-piece gardening tool set', 49.99, 44.99,
 (SELECT id FROM categories WHERE slug = 'home-garden'), 'GreenThumb', 'GT-TOOLS01', 20, true, false,
 ARRAY['https://example.com/garden-tools-1.jpg'],
 ARRAY['tools', 'garden', 'outdoor'], 12, 5, 4.3, 8)

ON CONFLICT (slug) DO UPDATE SET
  stock_quantity = products.stock_quantity + EXCLUDED.stock_quantity,
  views_count = EXCLUDED.views_count,
  sales_count = EXCLUDED.sales_count;

-- Create some test customer profiles (need to create users first, but we'll simulate orders)
-- Insert sample orders with the admin user as customer for testing
DO $$
DECLARE
    admin_user_id uuid;
    sample_orders uuid[];
    order_id uuid;
    product_ids uuid[];
    i integer;
BEGIN
    -- Get admin user ID
    SELECT id INTO admin_user_id FROM profiles WHERE email = 'tausiful11@gmail.com' LIMIT 1;
    
    IF admin_user_id IS NULL THEN
        RAISE NOTICE 'Admin user not found, creating sample orders with NULL user_id';
    END IF;
    
    -- Get some product IDs
    SELECT ARRAY_AGG(id) INTO product_ids FROM products LIMIT 6;
    
    -- Create sample orders from the last 30 days
    FOR i IN 1..15 LOOP
        order_id := gen_random_uuid();
        
        INSERT INTO orders (
            id,
            order_number,
            user_id,
            guest_email,
            guest_name,
            guest_phone,
            subtotal,
            tax_amount,
            shipping_amount,
            discount_amount,
            total_amount,
            status,
            payment_method,
            payment_status,
            shipping_address,
            billing_address,
            created_at
        ) VALUES (
            order_id,
            'ORD-' || TO_CHAR(NOW() - (i || ' days')::interval, 'YYYYMMDD') || '-' || LPAD(i::text, 4, '0'),
            CASE WHEN i % 3 = 0 THEN admin_user_id ELSE NULL END,
            CASE WHEN i % 3 != 0 THEN 'customer' || i || '@example.com' ELSE NULL END,
            CASE WHEN i % 3 != 0 THEN 'Customer ' || i ELSE NULL END,
            CASE WHEN i % 3 != 0 THEN '+1-555-' || LPAD(i::text, 3, '0') || '-' || LPAD((i*12)::text, 4, '0') ELSE NULL END,
            50.00 + (i * 25.99),
            (50.00 + (i * 25.99)) * 0.08,
            CASE WHEN (50.00 + (i * 25.99)) > 100 THEN 0 ELSE 9.99 END,
            CASE WHEN i % 4 = 0 THEN 10.00 ELSE 0 END,
            (50.00 + (i * 25.99)) * 1.08 + CASE WHEN (50.00 + (i * 25.99)) > 100 THEN 0 ELSE 9.99 END - CASE WHEN i % 4 = 0 THEN 10.00 ELSE 0 END,
            CASE 
                WHEN i % 5 = 0 THEN 'delivered'::order_status
                WHEN i % 5 = 1 THEN 'shipped'::order_status
                WHEN i % 5 = 2 THEN 'processing'::order_status
                WHEN i % 5 = 3 THEN 'confirmed'::order_status
                ELSE 'pending'::order_status
            END,
            CASE WHEN i % 3 = 0 THEN 'stripe' ELSE 'cod' END,
            CASE WHEN i % 3 = 0 THEN 'paid' ELSE 'pending' END,
            jsonb_build_object(
                'name', 'Customer ' || i,
                'street', i || ' Test Street',
                'city', 'Test City',
                'state', 'TS',
                'zip', '1234' || i,
                'country', 'Bangladesh',
                'phone', '+880-1' || LPAD(i::text, 9, '0')
            ),
            jsonb_build_object(
                'name', 'Customer ' || i,
                'street', i || ' Test Street',
                'city', 'Test City',
                'state', 'TS',
                'zip', '1234' || i,
                'country', 'Bangladesh'
            ),
            NOW() - (i || ' days')::interval
        );
        
        -- Add 1-3 order items per order
        FOR j IN 1..(1 + (i % 3)) LOOP
            INSERT INTO order_items (
                order_id,
                product_id,
                product_name,
                quantity,
                unit_price,
                total_price,
                created_at
            )
            SELECT 
                order_id,
                product_ids[((i + j - 1) % array_length(product_ids, 1)) + 1],
                p.name,
                1 + (j % 3),
                COALESCE(p.sale_price, p.base_price),
                (1 + (j % 3)) * COALESCE(p.sale_price, p.base_price),
                NOW() - (i || ' days')::interval
            FROM products p 
            WHERE p.id = product_ids[((i + j - 1) % array_length(product_ids, 1)) + 1];
        END LOOP;
        
    END LOOP;
    
    RAISE NOTICE 'Created 15 sample orders with order items';
END $$;

-- Add some inventory movements for testing
INSERT INTO inventory_movements (
    product_id,
    movement_type,
    quantity,
    previous_stock,
    new_stock,
    reason,
    reference_type,
    created_at
)
SELECT 
    p.id,
    'sale',
    oi.quantity,
    p.stock_quantity + oi.quantity,
    p.stock_quantity,
    'Test order',
    'order',
    oi.created_at
FROM order_items oi
JOIN products p ON p.id = oi.product_id
LIMIT 20;

-- Update product sales counts based on order items
UPDATE products SET
    sales_count = (
        SELECT COALESCE(SUM(oi.quantity), 0)
        FROM order_items oi
        WHERE oi.product_id = products.id
    );

-- Create some inventory alerts for testing
INSERT INTO inventory_alerts (product_id, alert_type, threshold, current_stock)
SELECT 
    id,
    CASE 
        WHEN stock_quantity = 0 THEN 'out_of_stock'
        WHEN stock_quantity <= low_stock_threshold THEN 'low_stock'
        ELSE 'low_stock'
    END,
    low_stock_threshold,
    stock_quantity
FROM products
WHERE stock_quantity <= low_stock_threshold OR stock_quantity = 0;

-- Add some admin notifications
INSERT INTO admin_notifications (type, title, message, data, created_at) VALUES
('order', 'New Order Received', 'Order #ORD-20250902-0001 has been placed', 
 jsonb_build_object('order_id', (SELECT id FROM orders LIMIT 1), 'amount', 125.99), 
 NOW() - '2 hours'::interval),
('inventory', 'Low Stock Alert', 'iPhone 15 Pro is running low on stock', 
 jsonb_build_object('product_id', (SELECT id FROM products WHERE name = 'iPhone 15 Pro'), 'current_stock', 5), 
 NOW() - '1 hour'::interval),
('system', 'Daily Sales Report', 'Today''s sales: $2,456.78 from 12 orders', 
 jsonb_build_object('sales', 2456.78, 'orders', 12), 
 NOW() - '30 minutes'::interval);

-- Update category product counts
UPDATE categories SET
    product_count = (
        SELECT COUNT(*)
        FROM products
        WHERE products.category_id = categories.id
        AND products.is_active = true
    );

-- Display summary
SELECT 
    'Database populated successfully!' as message,
    (SELECT COUNT(*) FROM products) as total_products,
    (SELECT COUNT(*) FROM orders) as total_orders,
    (SELECT COUNT(*) FROM order_items) as total_order_items,
    (SELECT COUNT(*) FROM categories) as total_categories;
