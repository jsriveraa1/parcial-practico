import {
  Body,
  Controller, Delete,
  Get, HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors
} from "@nestjs/common";
import { BusinessErrorsInterceptor } from '../../shared/interceptors/business-errors/business-errors.interceptor';
import { ProductoTiendaService } from '../service/producto-tienda.service';
import { TiendaDto } from '../../tienda/dto/tienda.dto';
import { TiendaEntity } from '../../tienda/entity/tienda.entity';
import { plainToInstance } from 'class-transformer';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoTiendaController {
  constructor(private readonly productoTiendaService: ProductoTiendaService) {}

  @Post(':productId/stores/:storeId')
  async addArtworkMuseum(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    return await this.productoTiendaService.addStoreToProduct(
      productId,
      storeId,
    );
  }

  @Get(':productId/stores/:storeId')
  async findArtworkByMuseumIdArtworkId(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    return await this.productoTiendaService.findStoreFromProduct(
      productId,
      storeId,
    );
  }

  @Get(':productId/stores')
  async findArtworksByMuseumId(@Param('productId') productId: string) {
    return await this.productoTiendaService.findStoresFromProduct(productId);
  }

  @Put(':productId/stores')
  async associateArtworksMuseum(
    @Body() storesDto: TiendaDto[],
    @Param('productId') productId: string,
  ) {
    const stores = plainToInstance(TiendaEntity, storesDto);
    return await this.productoTiendaService.updateStoresFromProduct(
      productId,
      stores,
    );
  }

  @Delete(':productId/stores/:storeId')
  @HttpCode(204)
  async deleteArtworkMuseum(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    return await this.productoTiendaService.deleteStoreFromProduct(
      productId,
      storeId,
    );
  }
}
