-- ============================================
-- BASHABHARA.AI - Simple Database Schema
-- 15 Features
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE 1: users (Feature 1: Auth & RBAC)
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'TENANT' CHECK (role IN ('TENANT', 'OWNER', 'ADMIN')),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP,
    refresh_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users
ADD COLUMN profile_image TEXT;
-- ============================================
-- TABLE 2: properties (Feature 2: Listing Management)
-- ============================================
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    area DECIMAL(10, 2) NOT NULL,
    location TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    property_type VARCHAR(50) CHECK (property_type IN ('APARTMENT', 'HOUSE', 'FLAT', 'STUDIO', 'PENTHOUSE', 'DUPLEX')),
    furnished BOOLEAN DEFAULT FALSE,
    family_bachelor VARCHAR(20) DEFAULT 'ANY' CHECK (family_bachelor IN ('FAMILY', 'BACHELOR', 'ANY')),
    parking BOOLEAN DEFAULT FALSE,
    lift BOOLEAN DEFAULT FALSE,
    pet_friendly BOOLEAN DEFAULT FALSE,
    availability BOOLEAN DEFAULT TRUE,
    views INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    amenities TEXT[] DEFAULT '{}',
    nearby_facilities TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rental_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID UNIQUE NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    max_price DECIMAL(12, 2),

    location TEXT,

    bedrooms INTEGER,

    bathrooms INTEGER,

    min_area DECIMAL(10, 2),

    property_type VARCHAR(50)
        CHECK (
            property_type IS NULL OR
            property_type IN (
                'APARTMENT',
                'HOUSE',
                'FLAT',
                'STUDIO',
                'PENTHOUSE',
                'DUPLEX'
            )
        ),

    amenities TEXT[] DEFAULT '{}',

    nearby_facilities TEXT[] DEFAULT '{}',

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE ai_rental_chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    role VARCHAR(20) NOT NULL
        CHECK (role IN ('USER', 'AI')),

    message TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE property_match_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    property_id UUID NOT NULL
        REFERENCES properties(id) ON DELETE CASCADE,

    match_score DECIMAL(5,2) NOT NULL,

    email_sent BOOLEAN DEFAULT FALSE,

    sent_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, property_id)
);

-- ============================================
-- TABLE 3: bookings (Feature 6: Visit Booking)
-- ============================================
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'RESCHEDULED', 'COMPLETED', 'CANCELLED')),
    date TIMESTAMP NOT NULL,
    message TEXT,
    tenant_id UUID REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE 4: messages (Feature 7: Real-Time Chat)
-- ============================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE 5: favorites (Feature 9: Favorites)
-- ============================================
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, property_id)
);

-- ============================================
-- TABLE 6: comparisons (Feature 9: AI Comparison)
-- ============================================
CREATE TABLE comparisons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    property_ids UUID[] NOT NULL,
    ai_insights TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE 7: reviews (Feature 11: Reviews & Rating)
-- ============================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    ai_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE 8: maintenance (Feature 12: Maintenance)
-- ============================================
CREATE TABLE maintenance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED')),
    images TEXT[] DEFAULT '{}',
    tenant_id UUID REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- TABLE 10: subscriptions (Feature 14: Billing)
-- ============================================
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    plan VARCHAR(20) DEFAULT 'FREE' CHECK (plan IN ('FREE', 'PREMIUM')),
    is_active BOOLEAN DEFAULT FALSE,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE 11: payments (Feature 14: Billing)
-- ============================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id),
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'BDT',
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE 12: audit_logs (Feature 15: Admin Dashboard)
-- ============================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE 13: search_history (Feature 3: AI Search)
-- ============================================
CREATE TABLE search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    search_query TEXT NOT NULL,
    ai_parsed JSONB,
    results_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE 15: saved_searches (Phase 2: Saved Search)
-- ============================================
CREATE TABLE saved_searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    filters JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CREATE INDEXES (For faster queries)
-- ============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX idx_properties_owner_id ON properties(owner_id);
CREATE INDEX idx_properties_availability ON properties(availability);
CREATE INDEX idx_bookings_tenant_id ON bookings(tenant_id);
CREATE INDEX idx_bookings_property_id ON bookings(property_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_property_id ON favorites(property_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_property_id ON reviews(property_id);
CREATE INDEX idx_maintenance_tenant_id ON maintenance(tenant_id);
CREATE INDEX idx_maintenance_status ON maintenance(status);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_plan ON subscriptions(plan);

-- Full text search for AI search
CREATE INDEX idx_properties_search ON properties USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- ============================================
-- AUTO-UPDATE TIMESTAMP TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_maintenance_updated_at BEFORE UPDATE ON maintenance FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_saved_searches_updated_at BEFORE UPDATE ON saved_searches FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- INSERT SAMPLE DATA (For Testing)
-- ============================================

-- Admin (password: password123)
INSERT INTO users (id, email, password, full_name, role, is_verified) VALUES 
    (uuid_generate_v4(), 'admin@bashabhara.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrAJqJ6Qn5JqC5n5X9qo8uLOickgx2Z', 'Admin', 'ADMIN', TRUE);

-- Owner
INSERT INTO users (id, email, password, full_name, phone, role, is_verified) VALUES 
    (uuid_generate_v4(), 'owner@bashabhara.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrAJqJ6Qn5JqC5n5X9qo8uLOickgx2Z', 'John Owner', '+8801712345678', 'OWNER', TRUE);

-- Tenant
INSERT INTO users (id, email, password, full_name, phone, role, is_verified) VALUES 
    (uuid_generate_v4(), 'tenant@bashabhara.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrAJqJ6Qn5JqC5n5X9qo8uLOickgx2Z', 'Mike Tenant', '+8801812345678', 'TENANT', TRUE);

-- Sample Property
INSERT INTO properties (id, title, description, price, bedrooms, bathrooms, area, location, property_type, furnished, parking, lift, owner_id, amenities, images) VALUES 
    (uuid_generate_v4(), 'Family Apartment in Dhanmondi', 'Spacious 3-bedroom apartment', 25000, 3, 2, 1200, 'Dhanmondi, Dhaka', 'APARTMENT', TRUE, TRUE, TRUE, (SELECT id FROM users WHERE email = 'owner@bashabhara.com'), ARRAY['Parking', 'Lift', 'AC'], ARRAY['image1.jpg', 'image2.jpg']);

-- Sample Booking
INSERT INTO bookings (id, status, date, message, tenant_id, property_id, owner_id) VALUES 
    (uuid_generate_v4(), 'PENDING', CURRENT_TIMESTAMP + INTERVAL '2 days', 'I want to visit', (SELECT id FROM users WHERE email = 'tenant@bashabhara.com'), (SELECT id FROM properties WHERE title = 'Family Apartment in Dhanmondi'), (SELECT id FROM users WHERE email = 'owner@bashabhara.com'));

-- Sample Message
INSERT INTO messages (id, content, sender_id, receiver_id) VALUES 
    (uuid_generate_v4(), 'Is this available?', (SELECT id FROM users WHERE email = 'tenant@bashabhara.com'), (SELECT id FROM users WHERE email = 'owner@bashabhara.com'));

-- Sample Favorite
INSERT INTO favorites (id, user_id, property_id) VALUES 
    (uuid_generate_v4(), (SELECT id FROM users WHERE email = 'tenant@bashabhara.com'), (SELECT id FROM properties WHERE title = 'Family Apartment in Dhanmondi'));

-- Sample Review
INSERT INTO reviews (id, rating, comment, user_id, property_id) VALUES 
    (uuid_generate_v4(), 5, 'Great property!', (SELECT id FROM users WHERE email = 'tenant@bashabhara.com'), (SELECT id FROM properties WHERE title = 'Family Apartment in Dhanmondi'));

-- Sample Subscription
INSERT INTO subscriptions (id, user_id, plan, is_active, expires_at) VALUES 
    (uuid_generate_v4(), (SELECT id FROM users WHERE email = 'owner@bashabhara.com'), 'PREMIUM', TRUE, CURRENT_TIMESTAMP + INTERVAL '30 days');

CREATE INDEX idx_rental_requirements_user_id
ON rental_requirements(user_id);

CREATE INDEX idx_rental_requirements_active
ON rental_requirements(is_active);

CREATE INDEX idx_ai_rental_chats_user_id
ON ai_rental_chats(user_id);

CREATE INDEX idx_match_notifications_user_id
ON property_match_notifications(user_id);

CREATE INDEX idx_match_notifications_property_id
ON property_match_notifications(property_id);
-- ============================================
-- VERIFY TABLES
-- ============================================

SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

