-- Bangladesh Address System - Divisions and Districts
-- This will be added to the main database schema

-- Divisions table
CREATE TABLE IF NOT EXISTS divisions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  name_bn text,
  code text UNIQUE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Districts table
CREATE TABLE IF NOT EXISTS districts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  name_bn text,
  division_id uuid REFERENCES divisions(id) ON DELETE CASCADE,
  code text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(name, division_id)
);

-- Insert Bangladesh divisions
INSERT INTO divisions (name, name_bn, code) VALUES
('Dhaka', 'ঢাকা', 'DHK'),
('Chattogram', 'চট্টগ্রাম', 'CTG'),
('Rajshahi', 'রাজশাহী', 'RAJ'),
('Khulna', 'খুলনা', 'KHL'),
('Barishal', 'বরিশাল', 'BAR'),
('Sylhet', 'সিলেট', 'SYL'),
('Rangpur', 'রংপুর', 'RNG'),
('Mymensingh', 'ময়মনসিংহ', 'MYM')
ON CONFLICT (name) DO NOTHING;

-- Insert districts for each division
INSERT INTO districts (name, name_bn, division_id) VALUES
-- Dhaka Division
('Dhaka', 'ঢাকা', (SELECT id FROM divisions WHERE code = 'DHK')),
('Faridpur', 'ফরিদপুর', (SELECT id FROM divisions WHERE code = 'DHK')),
('Gazipur', 'গাজীপুর', (SELECT id FROM divisions WHERE code = 'DHK')),
('Gopalganj', 'গোপালগঞ্জ', (SELECT id FROM divisions WHERE code = 'DHK')),
('Kishoreganj', 'কিশোরগঞ্জ', (SELECT id FROM divisions WHERE code = 'DHK')),
('Madaripur', 'মাদারীপুর', (SELECT id FROM divisions WHERE code = 'DHK')),
('Manikganj', 'মানিকগঞ্জ', (SELECT id FROM divisions WHERE code = 'DHK')),
('Munshiganj', 'মুন্শিগঞ্জ', (SELECT id FROM divisions WHERE code = 'DHK')),
('Narayanganj', 'নারায়ণগঞ্জ', (SELECT id FROM divisions WHERE code = 'DHK')),
('Narsingdi', 'নরসিংদী', (SELECT id FROM divisions WHERE code = 'DHK')),
('Rajbari', 'রাজবাড়ী', (SELECT id FROM divisions WHERE code = 'DHK')),
('Shariatpur', 'শরীয়তপুর', (SELECT id FROM divisions WHERE code = 'DHK')),
('Tangail', 'টাঙ্গাইল', (SELECT id FROM divisions WHERE code = 'DHK')),

-- Chattogram Division
('Chattogram', 'চট্টগ্রাম', (SELECT id FROM divisions WHERE code = 'CTG')),
('Bandarban', 'বান্দরবান', (SELECT id FROM divisions WHERE code = 'CTG')),
('Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', (SELECT id FROM divisions WHERE code = 'CTG')),
('Chandpur', 'চাঁদপুর', (SELECT id FROM divisions WHERE code = 'CTG')),
('Cumilla', 'কুমিল্লা', (SELECT id FROM divisions WHERE code = 'CTG')),
('Coxs Bazar', 'কক্সবাজার', (SELECT id FROM divisions WHERE code = 'CTG')),
('Feni', 'ফেনী', (SELECT id FROM divisions WHERE code = 'CTG')),
('Khagrachhari', 'খাগড়াছড়ি', (SELECT id FROM divisions WHERE code = 'CTG')),
('Lakshmipur', 'লক্ষ্মীপুর', (SELECT id FROM divisions WHERE code = 'CTG')),
('Noakhali', 'নোয়াখালী', (SELECT id FROM divisions WHERE code = 'CTG')),
('Rangamati', 'রাঙ্গামাটি', (SELECT id FROM divisions WHERE code = 'CTG')),

-- Rajshahi Division
('Rajshahi', 'রাজশাহী', (SELECT id FROM divisions WHERE code = 'RAJ')),
('Bogura', 'বগুড়া', (SELECT id FROM divisions WHERE code = 'RAJ')),
('Joypurhat', 'জয়পুরহাট', (SELECT id FROM divisions WHERE code = 'RAJ')),
('Naogaon', 'নওগাঁ', (SELECT id FROM divisions WHERE code = 'RAJ')),
('Natore', 'নাটোর', (SELECT id FROM divisions WHERE code = 'RAJ')),
('Chapai Nawabganj', 'চাঁপাইনবাবগঞ্জ', (SELECT id FROM divisions WHERE code = 'RAJ')),
('Pabna', 'পাবনা', (SELECT id FROM divisions WHERE code = 'RAJ')),
('Sirajganj', 'সিরাজগঞ্জ', (SELECT id FROM divisions WHERE code = 'RAJ')),

-- Khulna Division
('Khulna', 'খুলনা', (SELECT id FROM divisions WHERE code = 'KHL')),
('Bagerhat', 'বাগেরহাট', (SELECT id FROM divisions WHERE code = 'KHL')),
('Chuadanga', 'চুয়াডাঙ্গা', (SELECT id FROM divisions WHERE code = 'KHL')),
('Jessore', 'যশোর', (SELECT id FROM divisions WHERE code = 'KHL')),
('Jhenaidah', 'ঝিনাইদহ', (SELECT id FROM divisions WHERE code = 'KHL')),
('Kushtia', 'কুষ্টিয়া', (SELECT id FROM divisions WHERE code = 'KHL')),
('Magura', 'মাগুরা', (SELECT id FROM divisions WHERE code = 'KHL')),
('Meherpur', 'মেহেরপুর', (SELECT id FROM divisions WHERE code = 'KHL')),
('Narail', 'নড়াইল', (SELECT id FROM divisions WHERE code = 'KHL')),
('Satkhira', 'সাতক্ষীরা', (SELECT id FROM divisions WHERE code = 'KHL')),

-- Barishal Division
('Barishal', 'বরিশাল', (SELECT id FROM divisions WHERE code = 'BAR')),
('Barguna', 'বরগুনা', (SELECT id FROM divisions WHERE code = 'BAR')),
('Bhola', 'ভোলা', (SELECT id FROM divisions WHERE code = 'BAR')),
('Jhalokathi', 'ঝালকাঠি', (SELECT id FROM divisions WHERE code = 'BAR')),
('Patuakhali', 'পটুয়াখালী', (SELECT id FROM divisions WHERE code = 'BAR')),
('Pirojpur', 'পিরোজপুর', (SELECT id FROM divisions WHERE code = 'BAR')),

-- Sylhet Division
('Sylhet', 'সিলেট', (SELECT id FROM divisions WHERE code = 'SYL')),
('Habiganj', 'হবিগঞ্জ', (SELECT id FROM divisions WHERE code = 'SYL')),
('Moulvibazar', 'মৌলভীবাজার', (SELECT id FROM divisions WHERE code = 'SYL')),
('Sunamganj', 'সুনামগঞ্জ', (SELECT id FROM divisions WHERE code = 'SYL')),

-- Rangpur Division
('Rangpur', 'রংপুর', (SELECT id FROM divisions WHERE code = 'RNG')),
('Dinajpur', 'দিনাজপুর', (SELECT id FROM divisions WHERE code = 'RNG')),
('Gaibandha', 'গাইবান্ধা', (SELECT id FROM divisions WHERE code = 'RNG')),
('Kurigram', 'কুড়িগ্রাম', (SELECT id FROM divisions WHERE code = 'RNG')),
('Lalmonirhat', 'লালমনিরহাট', (SELECT id FROM divisions WHERE code = 'RNG')),
('Nilphamari', 'নীলফামারী', (SELECT id FROM divisions WHERE code = 'RNG')),
('Panchagarh', 'পঞ্চগড়', (SELECT id FROM divisions WHERE code = 'RNG')),
('Thakurgaon', 'ঠাকুরগাঁও', (SELECT id FROM divisions WHERE code = 'RNG')),

-- Mymensingh Division
('Mymensingh', 'ময়মনসিংহ', (SELECT id FROM divisions WHERE code = 'MYM')),
('Jamalpur', 'জামালপুর', (SELECT id FROM divisions WHERE code = 'MYM')),
('Netrokona', 'নেত্রকোণা', (SELECT id FROM divisions WHERE code = 'MYM')),
('Sherpur', 'শেরপুর', (SELECT id FROM divisions WHERE code = 'MYM'))
ON CONFLICT (name, division_id) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_districts_division ON districts(division_id);
CREATE INDEX IF NOT EXISTS idx_divisions_active ON divisions(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_districts_active ON districts(is_active) WHERE is_active = true;

-- Create policies for public access
ALTER TABLE divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view divisions" ON divisions
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view districts" ON districts
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage divisions" ON divisions
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

CREATE POLICY "Admins can manage districts" ON districts
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));
