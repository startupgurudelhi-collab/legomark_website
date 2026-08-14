-- Legomark India / eFilingg PostgreSQL Database Schema
-- Optimized for Coolify / PostgreSQL production deployments
-- Compatible with PostgreSQL 14+ / 15+ / 16+

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'CLIENT',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 2. Clients Table
CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id),
    phone VARCHAR(50),
    company_name TEXT,
    gstin VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 3. Leads Table
CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(255) PRIMARY KEY,
    name TEXT NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    service TEXT NOT NULL,
    source TEXT NOT NULL,
    date VARCHAR(50) NOT NULL,
    status VARCHAR(100) NOT NULL DEFAULT 'New',
    notes TEXT,
    company_name TEXT,
    assigned_executive VARCHAR(255),
    priority VARCHAR(50),
    follow_up_date VARCHAR(50),
    attachments JSONB DEFAULT '[]'::jsonb,
    notes_history JSONB DEFAULT '[]'::jsonb,
    status_history JSONB DEFAULT '[]'::jsonb,
    follow_up_history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(255) PRIMARY KEY,
    lead_id VARCHAR(255) REFERENCES leads(id),
    customer_name TEXT NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_company_name TEXT,
    service TEXT NOT NULL,
    package_name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    gst INTEGER NOT NULL,
    discount INTEGER NOT NULL DEFAULT 0,
    total_amount INTEGER NOT NULL,
    assigned_executive VARCHAR(255) NOT NULL,
    payment_status VARCHAR(100) NOT NULL DEFAULT 'Pending',
    service_status VARCHAR(100) NOT NULL DEFAULT 'Documents Pending',
    attachments JSONB DEFAULT '[]'::jsonb,
    notes_history JSONB DEFAULT '[]'::jsonb,
    status_history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 5. Services Table
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(255) PRIMARY KEY,
    name TEXT NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(255) NOT NULL,
    description TEXT,
    icon_name VARCHAR(100),
    seo_meta_title TEXT,
    seo_meta_description TEXT,
    seo_keywords JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 6. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(255) PRIMARY KEY,
    name TEXT NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 7. Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
    id VARCHAR(255) PRIMARY KEY,
    title TEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    featured_image TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Draft',
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 8. Packages Table
CREATE TABLE IF NOT EXISTS packages (
    id VARCHAR(255) PRIMARY KEY,
    service_id VARCHAR(255) NOT NULL REFERENCES services(id),
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    discount_price INTEGER,
    gst_percent INTEGER NOT NULL DEFAULT 18,
    features JSONB DEFAULT '[]'::jsonb,
    display_order INTEGER NOT NULL DEFAULT 0,
    cta TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 9. Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(255) PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL REFERENCES orders(id),
    service TEXT NOT NULL,
    task_name TEXT NOT NULL,
    description TEXT,
    assigned_executive VARCHAR(255) NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
    status VARCHAR(100) NOT NULL DEFAULT 'Pending',
    due_date VARCHAR(50) NOT NULL,
    completed_date VARCHAR(50),
    notes TEXT,
    document_checklist JSONB DEFAULT '[]'::jsonb,
    comments JSONB DEFAULT '[]'::jsonb,
    activity_log JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 10. Workflow Templates Table
CREATE TABLE IF NOT EXISTS workflow_templates (
    id VARCHAR(255) PRIMARY KEY,
    service VARCHAR(255) NOT NULL UNIQUE,
    steps JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. Workflow Tasks Table
CREATE TABLE IF NOT EXISTS workflow_tasks (
    id VARCHAR(255) PRIMARY KEY,
    task_id VARCHAR(255) NOT NULL REFERENCES tasks(id),
    step_name TEXT NOT NULL,
    status VARCHAR(100) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(255) PRIMARY KEY,
    invoice_date VARCHAR(50) NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_company_name TEXT,
    customer_gstin VARCHAR(50),
    place_of_supply VARCHAR(255) NOT NULL,
    service TEXT NOT NULL,
    package_name VARCHAR(255) NOT NULL,
    hsn_sac VARCHAR(50) NOT NULL,
    taxable_amount INTEGER NOT NULL,
    cgst_rate INTEGER NOT NULL DEFAULT 0,
    cgst_amount INTEGER NOT NULL DEFAULT 0,
    sgst_rate INTEGER NOT NULL DEFAULT 0,
    sgst_amount INTEGER NOT NULL DEFAULT 0,
    igst_rate INTEGER NOT NULL DEFAULT 0,
    igst_amount INTEGER NOT NULL DEFAULT 0,
    total_amount INTEGER NOT NULL,
    payment_status VARCHAR(100) NOT NULL DEFAULT 'Unpaid',
    payment_method VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 13. Quotations Table
CREATE TABLE IF NOT EXISTS quotations (
    id VARCHAR(255) PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_company_name TEXT,
    service TEXT NOT NULL,
    package_name VARCHAR(255) NOT NULL,
    items JSONB DEFAULT '[]'::jsonb,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price INTEGER NOT NULL,
    discount INTEGER NOT NULL DEFAULT 0,
    gst_percent INTEGER NOT NULL DEFAULT 18,
    gst_amount INTEGER NOT NULL,
    total_amount INTEGER NOT NULL,
    valid_until VARCHAR(100) NOT NULL,
    notes TEXT,
    status VARCHAR(100) NOT NULL DEFAULT 'Draft',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 14. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(255) PRIMARY KEY,
    invoice_id VARCHAR(255) NOT NULL REFERENCES invoices(id),
    customer_email VARCHAR(255) NOT NULL,
    method VARCHAR(100) NOT NULL,
    amount INTEGER NOT NULL,
    status VARCHAR(100) NOT NULL DEFAULT 'Pending',
    transaction_ref VARCHAR(255) NOT NULL,
    paid_date VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 15. Receipts Table
CREATE TABLE IF NOT EXISTS receipts (
    id VARCHAR(255) PRIMARY KEY,
    payment_ref VARCHAR(255) NOT NULL,
    amount INTEGER NOT NULL,
    date VARCHAR(50) NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_company_name TEXT,
    order_id VARCHAR(255),
    invoice_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 16. Support Tickets Table
CREATE TABLE IF NOT EXISTS support_tickets (
    id VARCHAR(255) PRIMARY KEY,
    client_email VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
    status VARCHAR(100) NOT NULL DEFAULT 'Open',
    description TEXT NOT NULL,
    messages JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 17. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(255) PRIMARY KEY,
    client_email VARCHAR(255) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'info',
    date VARCHAR(50) NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 18. Automation Logs Table
CREATE TABLE IF NOT EXISTS automation_logs (
    id VARCHAR(255) PRIMARY KEY,
    event_name TEXT NOT NULL,
    status VARCHAR(100) NOT NULL,
    details TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 19. CMS Settings Table
CREATE TABLE IF NOT EXISTS cms_settings (
    id VARCHAR(255) PRIMARY KEY,
    key VARCHAR(255) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 20. Client Logos Table
CREATE TABLE IF NOT EXISTS client_logos (
    id VARCHAR(255) PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 21. Homepage Sections Table
CREATE TABLE IF NOT EXISTS homepage_sections (
    id VARCHAR(255) PRIMARY KEY,
    section_key VARCHAR(255) NOT NULL UNIQUE,
    title TEXT,
    subtitle TEXT,
    badge VARCHAR(255),
    content JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
