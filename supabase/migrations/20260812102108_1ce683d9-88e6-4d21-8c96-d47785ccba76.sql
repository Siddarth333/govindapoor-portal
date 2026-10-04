
CREATE POLICY "village files readable" ON storage.objects FOR SELECT USING (bucket_id = 'village');
CREATE POLICY "village files admin insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'village' AND public.is_admin());
CREATE POLICY "village files admin update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'village' AND public.is_admin());
CREATE POLICY "village files admin delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'village' AND public.is_admin());
