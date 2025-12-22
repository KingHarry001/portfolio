import { supabase } from './lib/supabase';

async function testConnection() {
  const { data, error } = await supabase.from('projects').select('count');
  console.log('Supabase test:', { data, error });
}

testConnection();