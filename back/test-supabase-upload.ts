
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

async function testUpload() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;

    console.log('Testing Supabase Connection...');
    console.log('URL:', url);

    if (!url || !key) {
        console.error('Missing SUPABASE_URL or SUPABASE_KEY');
        return;
    }

    const supabase = createClient(url, key);

    console.log('Listing Buckets...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
        console.error('❌ Failed to list buckets:', listError.message);
        console.error('Full Error:', listError);
    } else {
        console.log('✅ Buckets:', buckets.map(b => b.name));
        const productsBucket = buckets.find(b => b.name === 'products');
        if (!productsBucket) {
            console.error('❌ "products" bucket NOT FOUND!');
        } else {
            console.log('✅ "products" bucket found.');
            console.log('Public:', productsBucket.public);
        }
    }

    // Try upload anyway to see the error
    const fileName = `test-upload-${Date.now()}.txt`;
    console.log(`\nAttempting to upload ${fileName} to 'products' bucket...`);

    const { data, error } = await supabase.storage
        .from('products')
        .upload(`public/${fileName}`, 'Test Content', {
            contentType: 'text/plain',
            upsert: false
        });

    if (error) {
        console.error('❌ Upload Failed!');
        console.error('Error Message:', error.message);
        console.error('Error Details:', error);
    } else {
        console.log('✅ Upload Successful!');
        // Clean up
        await supabase.storage.from('products').remove([`public/${fileName}`]);
    }
}

testUpload();
