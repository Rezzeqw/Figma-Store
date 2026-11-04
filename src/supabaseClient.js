import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hroshojuhocuxegxnqbi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhyb3Nob2p1aG9jdXhlZ3hucWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3ODMwMDYsImV4cCI6MjEwOTM1OTAwNn0.A0yDB8cD_uwYn7ggQWuzb4AYeWSaycC_TyzqatekBaw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);