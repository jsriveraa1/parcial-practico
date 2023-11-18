import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from '../entity/producto.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../../shared/errors/business-errors';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async findAll(): Promise<ProductoEntity[]> {
    return await this.productoRepository.find({
      relations: ['tiendas'],
    });
  }

  async findOne(id: string): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto con el id buscado no se encontró',
        BusinessError.NOT_FOUND,
      );

    return producto;
  }

  async create(producto: ProductoEntity): Promise<ProductoEntity> {
    console.log('valor: ' + producto.tipo);
    if (producto.tipo == 0 || producto.tipo == 1) {
      return await this.productoRepository.save(producto);
    }
  }

  async update(id: string, producto: ProductoEntity): Promise<ProductoEntity> {
    const persistedProducto: ProductoEntity =
      await this.productoRepository.findOne({ where: { id } });
    if (!persistedProducto)
      throw new BusinessLogicException(
        'El producto con el id buscado no se encontró',
        BusinessError.NOT_FOUND,
      );

    if (producto.tipo == 0 || producto.tipo == 1) {
      return await this.productoRepository.save({
        ...persistedProducto,
        ...producto,
      });
    }
  }

  async delete(id: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto con el id buscado no se encontró',
        BusinessError.NOT_FOUND,
      );

    await this.productoRepository.remove(producto);
  }
}
