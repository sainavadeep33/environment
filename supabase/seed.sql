-- ============================================================================
-- GreenCred Initial Seed Data
-- ============================================================================

-- 1. Activity Credit Rules
INSERT INTO public.activity_credit_rules (activity_type, title, description, default_credits, co2_savings_kg, icon, is_active)
VALUES
    ('recycling', 'Recycling & Segregated Waste', 'Segregate and deposit recyclable plastic, glass, aluminum, or electronic waste at designated campus recycling stations.', 15, 2.40, 'recycle', true),
    ('tree_planting', 'Tree Planting & Sapling Care', 'Plant a new tree on campus or adopt and document the watering and maintenance of campus flora.', 50, 15.00, 'tree-pine', true),
    ('sustainable_transport', 'Sustainable Transport / Cycling', 'Commute to campus via bicycle, electric campus shuttle, carpooling, or walking instead of single-occupancy fossil fuel vehicles.', 20, 3.80, 'bike', true),
    ('plastic_reduction', 'Single-Use Plastic Reduction', 'Use reusable cups, bottles, containers, or cutlery in campus dining halls and coffee shops for 5 consecutive days.', 25, 1.90, 'shield-check', true),
    ('campus_cleanup', 'Campus Clean-Up Drive', 'Participate in organized student cleanliness campaigns, plogging, or quad restoration efforts.', 40, 8.50, 'sparkles', true)
ON CONFLICT (activity_type) DO UPDATE 
SET title = EXCLUDED.title,
    description = EXCLUDED.description,
    default_credits = EXCLUDED.default_credits,
    co2_savings_kg = EXCLUDED.co2_savings_kg;

-- 2. Rewards Catalog
INSERT INTO public.rewards (title, description, category, image_url, credit_cost, initial_stock, available_stock, is_active)
VALUES
    (
        'Campus Eco-Thermal Tumbler',
        'Double-wall insulated stainless steel 500ml flask. Keeps hot coffee warm for 12 hours and reduces disposable cups.',
        'Merchandise',
        'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=600&q=80',
        120,
        50,
        46,
        true
    ),
    (
        'Campus Cafeteria $10 Meal Voucher',
        'Valid for healthy salads, vegan wraps, and fresh meals at any campus dining hall or cooperative cafe.',
        'Dining',
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        80,
        100,
        82,
        true
    ),
    (
        'Tree Planted in Your Name Certificate',
        'A native tree planted in the university botanical sanctuary with your name tagged and GPS coordinates tracked.',
        'Recognition',
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
        150,
        200,
        194,
        true
    ),
    (
        'Campus Bike Share 1-Month Pass',
        'Unlimited free 60-minute rentals across all campus bike-sharing docking stations.',
        'Transit',
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
        100,
        60,
        55,
        true
    ),
    (
        'Zero-Waste Bamboo Cutlery & Straw Kit',
        'Portable organic bamboo fork, spoon, knife, chopsticks, and coconut fiber cleaner in a washable linen pouch.',
        'Merchandise',
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
        60,
        75,
        68,
        true
    ),
    (
        'University Bookstore $15 Textbook Credit',
        'Apply $15 discount towards any certified recycled paper notebook or second-hand course textbook.',
        'Academic',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
        140,
        40,
        31,
        true
    );

-- 3. Campus Sustainability Challenges
INSERT INTO public.challenges (title, description, activity_type, target_count, credit_reward, start_date, end_date, is_active)
VALUES
    (
        'Plastic-Free Quad Challenge',
        'Log 5 single-use plastic reduction actions this month to eliminate disposable plastics from student dining.',
        'plastic_reduction',
        5,
        60,
        CURRENT_DATE - INTERVAL '5 days',
        CURRENT_DATE + INTERVAL '25 days',
        true
    ),
    (
        'Spring Campus Reforestation',
        'Participate in planting or nurturing 3 trees or campus garden saplings during the spring greening festival.',
        'tree_planting',
        3,
        100,
        CURRENT_DATE - INTERVAL '2 days',
        CURRENT_DATE + INTERVAL '40 days',
        true
    ),
    (
        'Pedal & Stride: Low Carbon Commute',
        'Log 8 sustainable cycling or walking commutes to earn the campus eco-traveler crest.',
        'sustainable_transport',
        8,
        80,
        CURRENT_DATE - INTERVAL '10 days',
        CURRENT_DATE + INTERVAL '20 days',
        true
    );
