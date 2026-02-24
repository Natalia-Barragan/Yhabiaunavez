import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SizeController } from './size.controller';
import { SizeService } from './size.service';
import { Size } from './entities/size.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Size])],
  controllers: [SizeController],
  providers: [SizeService],
  exports: [SizeService],
})
export class SizeModule { }
