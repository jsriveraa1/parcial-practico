import { Module } from '@nestjs/common';
import { ProductoService } from './service/producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from './entity/producto.entity';

@Module({
  providers: [ProductoService],
  imports: [TypeOrmModule.forFeature([ProductoEntity])],
})
export class ProductoModule {}
