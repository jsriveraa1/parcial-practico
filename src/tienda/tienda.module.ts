import { Module } from '@nestjs/common';
import { TiendaService } from './service/tienda.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaEntity } from './entity/tienda.entity';

@Module({
  providers: [TiendaService],
  imports: [TypeOrmModule.forFeature([TiendaEntity])],
})
export class TiendaModule {}
