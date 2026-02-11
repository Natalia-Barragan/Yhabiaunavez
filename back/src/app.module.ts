import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Importamos tus módulos
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './category/category.module';
import { CustomerModule } from './customer/customer.module';
import { OrdersModule } from './orders/orders.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    // 1. Configuración para leer el archivo .env
    ConfigModule.forRoot({ isGlobal: true }),

    // 2. Conexión a la Base de Datos (Postgres en Supabase)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: 'postgres', // Usuario por defecto en Supabase
      password: process.env.DB_PASSWORD,
      database: 'postgres',
      autoLoadEntities: true, // Carga automática de tus entidades
      synchronize: true, // ¡Cuidado! Esto crea las tablas automáticamente (solo para desarrollo)
      ssl: { rejectUnauthorized: false }, // Requerido por Supabase
    }),

    // 3. Tus módulos
    ProductsModule,
    CategoriesModule,
    CustomerModule,
    OrdersModule,
    SupabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }