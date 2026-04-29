import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './category/category.module';
import { CustomerModule } from './customer/customer.module';
import { OrdersModule } from './orders/orders.module';
import { SupabaseModule } from './supabase/supabase.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SizeModule } from './size/size.module';
import { PingController } from './ping.controller';
import { MercadopagoModule } from './mercadopago/mercadopago.module';

@Module({
  imports: [
    // Rate Limiting: 100 requests por 60 segundos por IP
    ThrottlerModule.forRoot([
      {
        ttl: 60000,  // Ventana de tiempo: 60 segundos (en ms)
        limit: 100,  // Máximo: 100 requests por ventana
      },
    ]),
    
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        if (databaseUrl) {
          return {
            type: 'postgres' as const,
            url: databaseUrl,
            autoLoadEntities: true,
            synchronize: false,
            ssl: { rejectUnauthorized: false },
            extra: { family: 4 },
          };
        }

        const host = configService.get<string>('DB_HOST') || 'localhost';
        const port = configService.get<number>('DB_PORT') || 5432;
        return {
          type: 'postgres' as const,
          host,
          port: Number(port),
          username: configService.get<string>('DB_USERNAME') || 'postgres',
          password: configService.get<string>('DB_PASSWORD') || '',
          database: configService.get<string>('DB_NAME') || 'postgres',
          autoLoadEntities: true,
          synchronize: false,
          ssl: { rejectUnauthorized: false },
          extra: { family: 4 },
        };
      },
    }),

    ProductsModule,
    CategoriesModule,
    CustomerModule,
    OrdersModule,
    SupabaseModule,
    UsersModule,
    AuthModule,
    SizeModule,
    MercadopagoModule,
  ],
  controllers: [AppController, PingController],
  providers: [AppService],
})
export class AppModule { }
