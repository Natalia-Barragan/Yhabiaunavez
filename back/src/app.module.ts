import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Feature Modules
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './category/category.module';
import { CustomerModule } from './customer/customer.module';
import { OrdersModule } from './orders/orders.module';
import { SupabaseModule } from './supabase/supabase.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 1. Load environment variables
    ConfigModule.forRoot({ isGlobal: true }),

    // 2. Database Connection (Postgres on Supabase)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('DB_HOST');
        const port = configService.get<number>('DB_PORT');
        console.log(`Intentando conectar a DB en ${host}:${port}`);
        return {
          type: 'postgres' as const,
          host: host || 'localhost',
          port: Number(port) || 5432,
          username: configService.get<string>('DB_USERNAME') || 'postgres',
          password: configService.get<string>('DB_PASSWORD') || '',
          database: configService.get<string>('DB_NAME') || 'postgres',
          autoLoadEntities: true,
          synchronize: false, // Desactivado para evitar pérdida accidental de datos
          ssl: { rejectUnauthorized: false },
        };
      },
    }),

    // 3. Feature Modules
    ProductsModule,
    CategoriesModule,
    CustomerModule,
    OrdersModule,
    SupabaseModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }