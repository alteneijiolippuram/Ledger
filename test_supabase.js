const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://fqrxizfhtoejukgogfne.supabase.co";
const SUPABASE_KEY = "sb_publishable_yYgNS9OdxRRY0u9kmCg9tw_tASWKAIG";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
    const { data, error } = await supabase.from('income').select('*').limit(1);
    console.log("Data:", data);
    console.log("Error:", error);
}

test();
