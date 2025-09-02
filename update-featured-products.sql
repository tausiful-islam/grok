-- Update products to make them featured
UPDATE products 
SET is_featured = true 
WHERE slug IN ('wireless-headphones', 'cotton-t-shirt', 'garden-hose');

-- Check the updated products
SELECT id, name, is_featured, is_active FROM products;
