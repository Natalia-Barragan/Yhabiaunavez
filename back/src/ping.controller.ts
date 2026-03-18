import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm'; // Importamos el DataSource para la DB

@Controller('ping')
export class PingController {
    constructor(private readonly dataSource: DataSource) { }

    @Get()
    async getPing() {
        try {
            await this.dataSource.query('SELECT 1');

            return {
                status: 'ok',
                database: 'connected',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                status: 'error',
                message: 'Server is awake but Database is not responding',
                error: error.message
            };
        }
    }
}