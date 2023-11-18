import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ProductoService } from '../service/producto.service';
import { BusinessErrorsInterceptor } from '../../shared/interceptors/business-errors/business-errors.interceptor';
import { ProductoDto } from '../dto/producto.dto';
import { ProductoEntity } from '../entity/producto.entity';
import { plainToInstance } from 'class-transformer';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('products')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Get()
  async findAll() {
    return await this.productoService.findAll();
  }

  @Get(':productId')
  async findOne(@Param('productId') productId: string) {
    return await this.productoService.findOne(productId);
  }

  @Post()
  async create(@Body(ValidationPipe) productDto: ProductoDto) {
    const producto: ProductoEntity = plainToInstance(
      ProductoEntity,
      productDto,
    );
    return await this.productoService.create(producto);
  }

  @Put(':productId')
  async update(
    @Param('productId') productId: string,
    @Body() productoDto: ProductoDto,
  ) {
    const producto: ProductoEntity = plainToInstance(
      ProductoEntity,
      productoDto,
    );
    return await this.productoService.update(productId, producto);
  }

  @Delete(':productId')
  @HttpCode(204)
  async delete(@Param('productId') productId: string) {
    return await this.productoService.delete(productId);
  }
}
