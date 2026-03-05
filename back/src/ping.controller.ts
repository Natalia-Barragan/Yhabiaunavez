import { Controller, Get } from '@nestjs/common';

@Controller('ping')
export class PingController {
    @Get()
    getPing() {
        return {
            status: 'ok',
            message: 'Servidor activo',
            timestamp: new Date().toISOString()
        };
    }
}