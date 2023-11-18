import { Module } from '@nestjs/common';
import { ProductoService } from './service/producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from './entity/producto.entity';
import { ProductoController } from './controller/producto.controller';

@Module({
  providers: [ProductoService],
  imports: [TypeOrmModule.forFeature([ProductoEntity])],
  controllers: [ProductoController],
})
export class ProductoModule {}
