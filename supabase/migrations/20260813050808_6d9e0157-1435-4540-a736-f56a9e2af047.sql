ALTER TABLE public.village_profile
  ADD COLUMN IF NOT EXISTS sarpanch_designation text NOT NULL DEFAULT 'Sarpanch',
  ADD COLUMN IF NOT EXISTS sarpanch_term text NOT NULL DEFAULT '2021 - 2026',
  ADD COLUMN IF NOT EXISTS sarpanch_phone text NOT NULL DEFAULT '+91 90000 00000',
  ADD COLUMN IF NOT EXISTS sarpanch_email text NOT NULL DEFAULT 'sarpanch@govindapoor.gov.in',
  ADD COLUMN IF NOT EXISTS sarpanch_education text NOT NULL DEFAULT 'B.A., Public Administration',
  ADD COLUMN IF NOT EXISTS sarpanch_address text NOT NULL DEFAULT 'Gram Panchayat Office, Govindapoor',
  ADD COLUMN IF NOT EXISTS sarpanch_ward text NOT NULL DEFAULT 'Ward 1',
  ADD COLUMN IF NOT EXISTS commitment_statement text NOT NULL DEFAULT '';

UPDATE public.village_profile
SET name = 'Govindapoor',
    map_url = 'https://maps.app.goo.gl/3nh5CnA8p5fbUdVD6',
    commitment_statement = CASE WHEN commitment_statement = '' THEN 'We commit to publishing every decision, every rupee and every project of Govindapoor Gram Panchayat in the open, to serve every household without discrimination, and to complete every sanctioned work on time and to standard.' ELSE commitment_statement END,
    office_address = 'Gram Panchayat Office, Govindapoor';

ALTER TABLE public.village_profile ALTER COLUMN name SET DEFAULT 'Govindapoor';

CREATE TABLE IF NOT EXISTS public.population_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ward text NOT NULL DEFAULT '',
  households integer NOT NULL DEFAULT 0,
  male integer NOT NULL DEFAULT 0,
  female integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  voters integer NOT NULL DEFAULT 0,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.population_records TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.population_records TO authenticated;
GRANT ALL ON public.population_records TO service_role;
ALTER TABLE public.population_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "population public read" ON public.population_records FOR SELECT USING (true);
CREATE POLICY "population admin insert" ON public.population_records FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "population admin update" ON public.population_records FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "population admin delete" ON public.population_records FOR DELETE TO authenticated USING (is_admin());
CREATE TRIGGER update_population_records_updated_at BEFORE UPDATE ON public.population_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.useful_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Government Website',
  url text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.useful_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.useful_links TO authenticated;
GRANT ALL ON public.useful_links TO service_role;
ALTER TABLE public.useful_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "links public read" ON public.useful_links FOR SELECT USING (true);
CREATE POLICY "links admin insert" ON public.useful_links FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "links admin update" ON public.useful_links FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "links admin delete" ON public.useful_links FOR DELETE TO authenticated USING (is_admin());
CREATE TRIGGER update_useful_links_updated_at BEFORE UPDATE ON public.useful_links FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.past_sarpanches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  term_from text NOT NULL DEFAULT '',
  term_to text NOT NULL DEFAULT '',
  details text NOT NULL DEFAULT '',
  major_works text NOT NULL DEFAULT '',
  photo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.past_sarpanches TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.past_sarpanches TO authenticated;
GRANT ALL ON public.past_sarpanches TO service_role;
ALTER TABLE public.past_sarpanches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "past public read" ON public.past_sarpanches FOR SELECT USING (true);
CREATE POLICY "past admin insert" ON public.past_sarpanches FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "past admin update" ON public.past_sarpanches FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "past admin delete" ON public.past_sarpanches FOR DELETE TO authenticated USING (is_admin());
CREATE TRIGGER update_past_sarpanches_updated_at BEFORE UPDATE ON public.past_sarpanches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.population_records (ward, households, male, female, total, voters, notes) VALUES
  ('Ward 1', 240, 498, 512, 1010, 742, 'Main bazaar and temple street'),
  ('Ward 2', 210, 432, 441, 873, 640, 'School and health centre area'),
  ('Ward 3', 265, 546, 553, 1099, 810, 'Tank bund and farm colony'),
  ('Ward 4', 195, 402, 398, 800, 588, 'New housing colony'),
  ('Ward 5', 210, 534, 534, 1068, 770, 'Outer hamlets');

INSERT INTO public.useful_links (title, description, category, url) VALUES
  ('India.gov.in National Portal', 'Single-window access to all Government of India services and information.', 'Government Website', 'https://www.india.gov.in'),
  ('eGramSwaraj', 'Panchayat planning, budgeting, accounting and online payments platform.', 'Government Website', 'https://egramswaraj.gov.in'),
  ('MGNREGA (NREGA) Portal', 'Job cards, muster rolls and wage payment status for rural employment.', 'Government Website', 'https://nrega.nic.in'),
  ('PM Awas Yojana - Gramin', 'Rural housing scheme application status and beneficiary lists.', 'Scheme', 'https://pmayg.nic.in'),
  ('PM Kisan Samman Nidhi', 'Farmer income support registration and instalment status.', 'Scheme', 'https://pmkisan.gov.in'),
  ('Ayushman Bharat (PM-JAY)', 'Health cover eligibility check and hospital search.', 'Scheme', 'https://pmjay.gov.in'),
  ('DigiLocker', 'Store and share Aadhaar, certificates and government documents digitally.', 'Mobile App', 'https://www.digilocker.gov.in'),
  ('UMANG App', 'Hundreds of central and state government services in a single app.', 'Mobile App', 'https://web.umang.gov.in'),
  ('mParivahan', 'Driving licence, RC and vehicle related services.', 'Mobile App', 'https://parivahan.gov.in'),
  ('Meebhoomi / Land Records', 'Check land records, pattadar passbook and adangal details.', 'Government Website', 'https://meebhoomi.ap.gov.in');

INSERT INTO public.past_sarpanches (name, term_from, term_to, details, major_works) VALUES
  ('Dasi Sravan Kumar', '2021', '2026', 'Current Sarpanch. Focused on digital governance and transparent fund reporting.', 'Launched the village digital portal, CC roads in Ward 2, drinking water pipeline extension.'),
  ('Placeholder Name', '2016', '2021', 'Served one full term as elected Sarpanch of the Gram Panchayat.', 'Village electrification upgrade, community hall construction, school compound wall.'),
  ('Placeholder Name', '2011', '2016', 'Served one full term as elected Sarpanch of the Gram Panchayat.', 'Tank bund strengthening, primary health sub-centre, internal drainage works.');