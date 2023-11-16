/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductoEntity } from "../../producto/entity/producto.entity";
import { TiendaEntity } from "../../tienda/entity/tienda.entity";

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [ProductoEntity, TiendaEntity],
    synchronize: true,
    keepConnectionAlive: true
  }),
  TypeOrmModule.forFeature([ProductoEntity, TiendaEntity]),
];