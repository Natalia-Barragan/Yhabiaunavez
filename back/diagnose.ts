
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { ProductsService } from './src/products/products.service';
import { SupabaseService } from './src/supabase/supabase.service';
import { CategoriesService } from './src/category/category.service';
import { CreateProductDto } from './src/products/dto/create-product.dto';

async function bootstrap() {
    console.log('Initializing NestJS Context...');
    const app = await NestFactory.createApplicationContext(AppModule, { logger: false });

    const productsService = app.get(ProductsService);
    const supabaseService = app.get(SupabaseService);
    const categoriesService = app.get(CategoriesService);

    console.log('--- DIAGNOSTIC START ---');

    // 1. Check Categories
    console.log('1. Fetching Categories...');
    let categoryId = '';
    try {
        const categories = await categoriesService.findAll();
        if (categories.length === 0) {
            console.warn('⚠️ No categories found. Creating a dummy one...');
            const newCat = await categoriesService.create({ name: 'Diag_' + Date.now() });
            categoryId = newCat.id;
            console.log('Created Category:', newCat);
        } else {
            categoryId = categories[0].id;
            console.log('✅ Found Category:', categories[0].name, 'ID:', categoryId);
        }
    } catch (e) {
        console.error('❌ Error fetching/creating categories:', e);
        if (e.message) console.error('Message:', e.message);
        await app.close();
        return;
    }

    // 2. Check Supabase Upload (Isolated)
    console.log('\n2. Testing Supabase Upload (Directly)...');
    const dummyFile: any = {
        originalname: 'diag-test.txt',
        mimetype: 'text/plain',
        buffer: Buffer.from('Diagnostic test file content'),
    };

    try {
        const imageUrl = await supabaseService.uploadImage(dummyFile);
        console.log('✅ Supabase Upload Successful! URL:', imageUrl);
    } catch (e) {
        console.error('❌ Supabase Upload Failed:', e);
        if (e.message) console.error('Message:', e.message);
        // We proceed to try product creation anyway to see if it fails there too
    }

    // 3. Check Product Creation
    console.log('\n3. Testing Product Creation (via Service)...');
    const dto: CreateProductDto = {
        name: 'Diagnostic Product ' + Date.now(),
        description: 'Test description',
        price: 100.50,
        stock: 10,
        categoryId: categoryId,
        image: undefined // Let the service handle upload
        ,
        sizes: []
    };

    try {
        const product = await productsService.create(dto, dummyFile);
        console.log('✅ Product Creation Successful!', product);
    } catch (e) {
        console.error('❌ Product Creation Failed:', e);
        if (e.message) console.error('Message:', e.message);
    }

    console.log('--- DIAGNOSTIC END ---');
    await app.close();
}

bootstrap().catch(err => console.error('Bootstrap Error:', err));
