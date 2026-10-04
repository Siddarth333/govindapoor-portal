
-- roles
CREATE TYPE public.app_role AS ENUM ('admin','citizen');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT 'Sarpanch',
  photo_url text,
  bio text,
  phone text,
  email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles public read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- new user: profile + first user becomes admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE existing int;
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name',''), NEW.email)
  ON CONFLICT (id) DO NOTHING;

  SELECT count(*) INTO existing FROM public.user_roles WHERE role = 'admin';
  IF existing = 0 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'citizen') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- village profile (single row)
CREATE TABLE public.village_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Govindapur',
  slogan text NOT NULL DEFAULT '',
  welcome_message text NOT NULL DEFAULT '',
  history text NOT NULL DEFAULT '',
  geography text NOT NULL DEFAULT '',
  culture text NOT NULL DEFAULT '',
  landmarks text NOT NULL DEFAULT '',
  education text NOT NULL DEFAULT '',
  healthcare text NOT NULL DEFAULT '',
  agriculture text NOT NULL DEFAULT '',
  map_url text NOT NULL DEFAULT '',
  office_address text NOT NULL DEFAULT '',
  office_hours text NOT NULL DEFAULT '',
  contact_phone text NOT NULL DEFAULT '',
  contact_email text NOT NULL DEFAULT '',
  stats jsonb NOT NULL DEFAULT '[]'::jsonb,
  funds jsonb NOT NULL DEFAULT '[]'::jsonb,
  timeline jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.village_profile TO anon;
GRANT SELECT, INSERT, UPDATE ON public.village_profile TO authenticated;
GRANT ALL ON public.village_profile TO service_role;
ALTER TABLE public.village_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "village public read" ON public.village_profile FOR SELECT USING (true);
CREATE POLICY "village admin write" ON public.village_profile FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "village admin update" ON public.village_profile FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER village_updated BEFORE UPDATE ON public.village_profile FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- announcements
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  urgent boolean NOT NULL DEFAULT false,
  pinned boolean NOT NULL DEFAULT false,
  published_on date NOT NULL DEFAULT current_date,
  file_url text,
  file_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- events
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  event_date date NOT NULL DEFAULT current_date,
  event_time text,
  location text,
  category text NOT NULL DEFAULT 'Community Events',
  image_url text,
  file_url text,
  file_name text,
  map_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- projects
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  section text NOT NULL DEFAULT 'Rural Development',
  category text NOT NULL DEFAULT '',
  budget numeric NOT NULL DEFAULT 0,
  spent numeric NOT NULL DEFAULT 0,
  progress int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Ongoing',
  image_url text,
  file_url text,
  completion_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- documents
CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Village Rules',
  file_url text,
  file_name text,
  published_on date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- meetings
CREATE TABLE public.meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  meeting_date date NOT NULL DEFAULT current_date,
  agenda text NOT NULL DEFAULT '',
  minutes text NOT NULL DEFAULT '',
  decisions text NOT NULL DEFAULT '',
  attendance text NOT NULL DEFAULT '',
  action_plan text NOT NULL DEFAULT '',
  file_url text,
  file_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- gallery
CREATE TABLE public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album text NOT NULL DEFAULT 'Village',
  caption text NOT NULL DEFAULT '',
  media_type text NOT NULL DEFAULT 'image',
  media_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- feedback
CREATE TABLE public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact text,
  kind text NOT NULL DEFAULT 'Suggestion',
  message text NOT NULL,
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['announcements','events','projects','documents','meetings','gallery'] LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "%s public read" ON public.%I FOR SELECT USING (true)', t, t);
    EXECUTE format('CREATE POLICY "%s admin insert" ON public.%I FOR INSERT TO authenticated WITH CHECK (public.is_admin())', t, t);
    EXECUTE format('CREATE POLICY "%s admin update" ON public.%I FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())', t, t);
    EXECUTE format('CREATE POLICY "%s admin delete" ON public.%I FOR DELETE TO authenticated USING (public.is_admin())', t, t);
    EXECUTE format('CREATE TRIGGER %I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()', t || '_updated', t);
  END LOOP;
END $$;

GRANT INSERT ON public.feedback TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.feedback TO authenticated;
GRANT ALL ON public.feedback TO service_role;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit feedback" ON public.feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "admin reads feedback" ON public.feedback FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin updates feedback" ON public.feedback FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin deletes feedback" ON public.feedback FOR DELETE TO authenticated USING (public.is_admin());

INSERT INTO public.village_profile (name, slogan, welcome_message, history, geography, culture, landmarks, education, healthcare, agriculture, map_url, office_address, office_hours, contact_phone, contact_email, stats, funds, timeline)
VALUES (
 'Govindapur',
 'Transparent Governance. Shared Progress.',
 'Welcome to the official digital portal of Govindapur Gram Panchayat. Every announcement, project, document and rupee spent is published here so that every citizen stays informed and involved.',
 'Govindapur has grown from a small farming settlement into a model Gram Panchayat, with generations of families building its schools, temples, tanks and roads through collective effort.',
 'The village spans fertile plains with seasonal streams and irrigation tanks, connected by an all-weather road to the mandal headquarters.',
 'Festivals, folk performances and community feasts remain at the heart of village life, bringing every household together through the year.',
 'Gram Panchayat Office, Village Temple, Community Hall, Primary Health Centre, Zilla Parishad High School.',
 '2 Primary Schools, 1 Zilla Parishad High School, 1 Digital Learning Centre.',
 '1 Primary Health Centre, 1 Sub-Centre, regular medical and blood donation camps.',
 'Paddy, cotton and pulses are the primary crops, supported by borewell and tank irrigation.',
 'https://maps.app.goo.gl/vQGZ6pjXWA1SmYcDA',
 'Gram Panchayat Office, Govindapur',
 'Monday to Saturday, 10:00 AM - 5:00 PM',
 '',
 '',
 '[{"label":"Population","value":"4,850"},{"label":"Households","value":"1,120"},{"label":"Schools","value":"3"},{"label":"Health Centres","value":"2"},{"label":"Roads Developed (km)","value":"18"},{"label":"Water Facilities","value":"24"},{"label":"Schemes Implemented","value":"31"}]'::jsonb,
 '[{"label":"Funds Received","value":"1,20,00,000"},{"label":"Funds Utilised","value":"86,40,000"},{"label":"Ongoing Projects","value":"7"},{"label":"Completed Projects","value":"19"}]'::jsonb,
 '[{"year":"1952","event":"Gram Panchayat formally constituted"},{"year":"1978","event":"First primary school opened"},{"year":"1996","event":"Village fully electrified"},{"year":"2014","event":"Piped drinking water supply commissioned"},{"year":"2023","event":"Smart Village digital initiatives launched"}]'::jsonb
);
