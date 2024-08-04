const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
console.log("process.env.SUPABASE_URL: ",process.env.SUPABASE_URL)
console.log("process.env.SUPABASE_ANON_KEY: ",process.env.SUPABASE_ANON_KEY)

module.exports = supabase;
