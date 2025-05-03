import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ertkiirzzswpxkgcxret.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVydGtpaXJ6enN3cHhrZ2N4cmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMjMzMDQsImV4cCI6MjA2MTY5OTMwNH0.iRJWPcAAMWu-9PDVuDJmui5PRKJjNDC2vazLclvRiKU'

export const supabase = createClient(supabaseUrl, supabaseKey);
