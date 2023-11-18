import { Module } from '@nestjs/common';
import { TiendaService } from './service/tienda.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaEntity } from './entity/tienda.entity';
import { TiendaController } from './controller/tienda.controller';

@Module({
  providers: [TiendaService],
  imports: [TypeOrmModule.forFeature([TiendaEntity])],
  controllers: [TiendaController],
})
export class TiendaModule {}
