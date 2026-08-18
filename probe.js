const fs = require('fs');
const envLines = fs.readFileSync('.env.local', 'utf8').split('\n');
const env = {};
envLines.forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) env[key.trim()] = rest.join('=').trim();
});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function getCols(table) {
    const keys = ['title', 'description', 'image', 'duration', 'price', 'instructor', 'date', 'discounted_price', 'featured', 'status', 'visible'];
    let currentKeys = [...keys];
    
    while (currentKeys.length > 0) {
        let payload = {};
        currentKeys.forEach(k => payload[k] = (k === 'featured' || k === 'visible' ? false : 'test'));
        const { error } = await supabase.from(table).insert([payload]).select();
        
        if (error) {
            if (error.message.includes('Could not find the') && error.message.includes('column')) {
                const match = error.message.match(/'([^']+)' column/);
                if (match) {
                    const badCol = match[1];
                    currentKeys = currentKeys.filter(k => k !== badCol);
                    continue;
                }
            } else {
                console.log(table, 'error:', error.message);
                break;
            }
        } else {
            console.log(table, 'success with keys:', currentKeys);
            break;
        }
    }
    console.log(table, 'Valid keys:', currentKeys);
}

async function run() {
    await getCols('kurslar');
    await getCols('telimler');
    await getCols('marafonlar');
    await getCols('kitablar');
}
run();
