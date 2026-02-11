import { Injectable, Logger, OnModuleInit, HttpException, HttpStatus } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
    private readonly logger = new Logger(SupabaseService.name);
    private supabase: SupabaseClient;

    onModuleInit() {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_KEY;

        if (!url || !key) {
            this.logger.error(
                'Faltan variables de entorno: SUPABASE_URL o SUPABASE_KEY no están definidas en el archivo .env',
            );
            throw new Error('Supabase configuration missing');
        }

        this.supabase = createClient(url, key);
        this.logger.log('✅ Supabase client initialized successfully');
    }

    get client() {
        return this.supabase;
    }

    async uploadImage(file: Express.Multer.File): Promise<string> {
        const fileName = `${Date.now()}-${file.originalname}`;

        const { data, error } = await this.supabase.storage
            .from('products')
            .upload(`public/${fileName}`, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (error) {
            this.logger.error(`Error subiendo imagen: ${error.message}`);

            // CONVERSIÓN DE ERROR:
            // Forzamos que el status sea un número para que Express no falle.
            // Si error.status no es un número válido, usamos 500 por defecto.
            const statusCode = typeof error.status === 'string'
                ? parseInt(error.status, 10)
                : (error.status || HttpStatus.INTERNAL_SERVER_ERROR);

            throw new HttpException(error.message, statusCode);
        }

        const { data: { publicUrl } } = this.supabase.storage
            .from('products')
            .getPublicUrl(`public/${fileName}`);

        return publicUrl;
    }
}