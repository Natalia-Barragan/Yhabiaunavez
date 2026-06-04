import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm'; // Importamos el DataSource para la DB

@Controller('ping')
export class PingController {
    constructor(private readonly dataSource: DataSource) { }

    @Get()
    async getPing() {
        let dbStatus = 'unknown';
        let dbError = null;
        let tables = [];
        let categoriesSampleError: any = null;
        let productsSampleError: any = null;

        try {
            await this.dataSource.query('SELECT 1');
            dbStatus = 'connected';
            
            // Query tables to check schema
            const tableList = await this.dataSource.query(`
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            `);
            tables = tableList.map(t => t.table_name);

            // Test query categories
            try {
                await this.dataSource.query('SELECT * FROM categories LIMIT 1');
            } catch (e: any) {
                categoriesSampleError = { message: e.message, code: e.code };
            }

            // Test query products
            try {
                await this.dataSource.query('SELECT * FROM products LIMIT 1');
            } catch (e: any) {
                productsSampleError = { message: e.message, code: e.code };
            }

        } catch (error: any) {
            dbStatus = 'error';
            dbError = error.message;
        }

        return {
            status: 'ok',
            database: dbStatus,
            dbError,
            tables,
            categoriesSampleError,
            productsSampleError,
            timestamp: new Date().toISOString()
        };
    }
}