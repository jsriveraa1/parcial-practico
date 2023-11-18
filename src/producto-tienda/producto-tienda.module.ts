import { Module } from '@nestjs/common';
import { ProductoTiendaService } from './service/producto-tienda.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/entity/producto.entity';
import { TiendaEntity } from '../tienda/entity/tienda.entity';
import { ProductoTiendaController } from './controller/producto-tienda.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductoEntity, TiendaEntity])],
  providers: [ProductoTiendaService],
  controllers: [ProductoTiendaController],
})
export class ProductoTiendaModule {}
