-- Supabase Schema for King Education Company

-- 1. Settings Table
CREATE TABLE public.settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT
);

-- 2. Users Table
CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Courses (Kurslar) Table
CREATE TABLE public.kurslar (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image TEXT,
    price VARCHAR(100),
    duration VARCHAR(100),
    features TEXT, -- JSON string or comma separated
    popular BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Books (Kitablar) Table
CREATE TABLE public.kitablar (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image TEXT,
    price VARCHAR(100),
    download_link TEXT,
    author VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Marathons (Marafonlar) Table
CREATE TABLE public.marafonlar (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image TEXT,
    date VARCHAR(255),
    duration VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Trainings (Təlimlər) Table
CREATE TABLE public.telimler (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image TEXT,
    date VARCHAR(255),
    trainer VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. News (Xəbərlər) Table
CREATE TABLE public.xeberler (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    image TEXT,
    date VARCHAR(255),
    author VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 8. Campaigns (Kampaniyalar) Table
CREATE TABLE public.kampaniyalar (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image TEXT,
    discount VARCHAR(100),
    expiry VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 9. PDF Books (PDF Kitablar) Table
CREATE TABLE public.pdf_kitablar (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    cover TEXT,
    file_url TEXT,
    category VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 10. Registrations & Contacts Table
CREATE TABLE public.registrations (
    id SERIAL PRIMARY KEY,
    form_type VARCHAR(100),
    name VARCHAR(255),
    phone VARCHAR(100),
    email VARCHAR(255),
    message TEXT,
    extra_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 11. Favorites Table
CREATE TABLE public.favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
    item_type VARCHAR(50),
    item_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, item_type, item_id)
);

-- Initial Settings Data (Default values)
INSERT INTO public.settings (key, value) VALUES
('phone', '+994 10 379 08 74'),
('email', 'info@kingeducation.az'),
('instagram', 'https://www.instagram.com/king.edu.az'),
('instagram_show', 'true'),
('facebook', 'https://www.facebook.com/profile.php?id=61591124085845'),
('facebook_show', 'true'),
('tiktok', 'https://www.tiktok.com/@king.edu.az'),
('tiktok_show', 'true'),
('telegram', 'https://t.me/+XokLJzABCDE3NWQy'),
('telegram_show', 'true'),
('volunteerLink', 'https://docs.google.com/forms/d/e/1FAIpQLSdDQuU3BxPv3C1t_ELe3va9Xr2-li11ZgFrzoBAWXVhLmHYvw/viewform?usp=header'),
('volunteerLink_show', 'true'),
('whatsapp_contact', 'https://api.whatsapp.com/send/?phone=994103790874&text&type=phone_number&app_absent=0'),
('whatsapp_contact_show', 'true'),
('youtube', 'https://www.youtube.com/@KingEducationCompanyMMC'),
('youtube_show', 'true'),
('linkedin', 'https://www.linkedin.com/in/king-education-company-mmc-528162415'),
('linkedin_show', 'true'),
('whatsapp_channel', 'https://www.whatsapp.com/channel/0029Vb1uTDm3AzNK7TnfBa0z'),
('whatsapp_channel_show', 'true'),
('leaderImage', '/img/rehber.jpeg'),
('leaderImageVisible', 'true'),
('premium_whatsapp', '010 379 08 74'),
('premium_price_1', '17.99'),
('premium_price_3', '27.99'),
('premium_price_6', '59.99'),
('premium_price_12', '111.99');

-- Insert initial admin user
INSERT INTO public.users (name, email, password, role) VALUES
('Mirfəqan Hacıyev', 'Mirfəqaninnotebooku@gmail.com', 'admin123', 'admin');
