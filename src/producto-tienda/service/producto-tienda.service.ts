import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from '../../producto/entity/producto.entity';
import { Repository } from 'typeorm';
import { TiendaEntity } from '../../tienda/entity/tienda.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../../shared/errors/business-errors';

@Injectable()
export class ProductoTiendaService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,

    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>,
  ) {}

  async addStoreToProduct(
    productId: string,
    storeId: string,
  ): Promise<ProductoEntity> {
    const store: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: storeId },
    });
    if (!store)
      throw new BusinessLogicException(
        'La tienda con el id no ha sido encontrada',
        BusinessError.NOT_FOUND,
      );

    const product: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productId },
      relations: ['tiendas'],
    });
    if (!product)
      throw new BusinessLogicException(
        'El producto con el id no ha sido encontrada',
        BusinessError.NOT_FOUND,
      );

    product.tiendas = [...product.tiendas, store];
    return await this.productoRepository.save(product);
  }

  async findStoreFromProduct(
    productId: string,
    storeId: string,
  ): Promise<TiendaEntity> {
    const store: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: storeId },
    });
    if (!store)
      throw new BusinessLogicException(
        'La tienda con el id no ha sido encontrada',
        BusinessError.NOT_FOUND,
      );

    const product: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productId },
      relations: ['tiendas'],
    });
    if (!product)
      throw new BusinessLogicException(
        'El producto con el id no ha sido encontrada',
        BusinessError.NOT_FOUND,
      );

    const productoStore: TiendaEntity = product.tiendas.find(
      (e) => e.id === store.id,
    );

    if (!productoStore)
      throw new BusinessLogicException(
        'La tienda con el id proporcionado no esta asociada con el producto',
        BusinessError.PRECONDITION_FAILED,
      );

    return productoStore;
  }

  async findStoresFromProduct(productId: string): Promise<TiendaEntity[]> {
    const product: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productId },
      relations: ['tiendas'],
    });
    if (!product)
      throw new BusinessLogicException(
        'El producto con el id no ha sido encontrada',
        BusinessError.NOT_FOUND,
      );

    return product.tiendas;
  }

  async updateStoresFromProduct(
    productId: string,
    stores: TiendaEntity[],
  ): Promise<ProductoEntity> {
    const product: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productId },
      relations: ['tiendas'],
    });

    if (!product)
      throw new BusinessLogicException(
        'El producto con el id no ha sido encontrada',
        BusinessError.NOT_FOUND,
      );

    for (const element of stores) {
      const store: TiendaEntity = await this.tiendaRepository.findOne({
        where: { id: element.id },
      });
      if (!store)
        throw new BusinessLogicException(
          'La tienda con el id no ha sido encontrada',
          BusinessError.NOT_FOUND,
        );
    }

    product.tiendas = stores;
    return await this.productoRepository.save(product);
  }

  async deleteStoreFromProduct(productoId: string, tiendaId: string) {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tiendaId },
    });
    if (!tienda)
      throw new BusinessLogicException(
        'La tienda con el id no ha sido encontrada',
        BusinessError.NOT_FOUND,
      );

    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto con el id no ha sido encontrada',
        BusinessError.NOT_FOUND,
      );

    const productoTienda: TiendaEntity = producto.tiendas.find(
      (e) => e.id === tienda.id,
    );

    if (!productoTienda)
      throw new BusinessLogicException(
        'La tienda con el id proporcionado no esta asociada con el producto',
        BusinessError.PRECONDITION_FAILED,
      );

    producto.tiendas = producto.tiendas.filter((e) => e.id !== tiendaId);
    await this.productoRepository.save(producto);
  }
}
