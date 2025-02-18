import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://coirgcnanbtdiwhlbpgs.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvaXJnY25hbmJ0ZGl3aGxicGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3Mzk1NjIsImV4cCI6MjA1NTMxNTU2Mn0.ex1JP8N1ax_z4Sj_nZrEZRBbcvqYy3cxwZkO9RLZzrM";
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };