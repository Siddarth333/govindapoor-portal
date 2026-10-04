
ALTER TABLE public.village_profile
  ADD COLUMN sarpanch_name text NOT NULL DEFAULT 'Dasi Sravan Kumar',
  ADD COLUMN sarpanch_photo text NOT NULL DEFAULT 'profile/sarpanch.jpg',
  ADD COLUMN sarpanch_message text NOT NULL DEFAULT '';
UPDATE public.village_profile SET
  sarpanch_name = 'Dasi Sravan Kumar',
  sarpanch_photo = 'profile/sarpanch.jpg',
  sarpanch_message = 'Our commitment is simple: every decision, every rupee and every project of Govindapur Gram Panchayat is published here for our citizens to see. I invite every villager to read, question and participate.';
