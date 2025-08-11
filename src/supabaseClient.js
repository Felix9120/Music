import { createClient } from '@supabase/supabase-js';

const supabaseUrl ='https://owsjtqwjnbpkuxhchsai.supabase.co';
const supabaseKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93c2p0cXdqbmJwa3V4aGNoc2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0OTM5MzEsImV4cCI6MjA2OTA2OTkzMX0.h93yT4cRQ98CNqgpSTMmOR3B9prRWoLKdeeTCn8gZL4'; 
export const supabase = createClient(supabaseUrl, supabaseKey);