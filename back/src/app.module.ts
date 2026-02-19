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
      // 1. CAMBIÁ EL PUERTO A 6543 (Fundamental para Render)
      port: 6543,
      // 2. CAMBIÁ EL USERNAME PARA INCLUIR TU ID DE PROYECTO
      // Esto soluciona el error "Tenant or user not found"
      username: 'postgres.gbeaegtyvxncudslomvi',
      password: process.env.DB_PASSWORD,
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
      ssl: { rejectUnauthorized: false },
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