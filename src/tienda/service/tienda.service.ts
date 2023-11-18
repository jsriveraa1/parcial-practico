import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TiendaEntity } from '../entity/tienda.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../../shared/errors/business-errors';

@Injectable()
export class TiendaService {
  constructor(
    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>,
  ) {}

  async findAll(): Promise<TiendaEntity[]> {
    return await this.tiendaRepository.find({
      relations: ['productos'],
    });
  }

  async findOne(id: string): Promise<TiendaEntity> {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
      relations: ['productos'],
    });
    if (!tienda)
      throw new BusinessLogicException(
        'La tienda con el id buscado no se encontró',
        BusinessError.NOT_FOUND,
      );

    return tienda;
  }

  async create(tienda: TiendaEntity): Promise<TiendaEntity> {
    if (this.validarCiudad(tienda.ciudad)) {
      return await this.tiendaRepository.save(tienda);
    }
    throw new BusinessLogicException(
      'La ciudad no cumple con el código de 3 caracteres',
      BusinessError.PRECONDITION_FAILED,
    );
  }

  async update(id: string, tienda: TiendaEntity): Promise<TiendaEntity> {
    const persistedProducto: TiendaEntity = await this.tiendaRepository.findOne(
      { where: { id } },
    );
    if (!persistedProducto)
      throw new BusinessLogicException(
        'La tienda con el id buscado no se encontró',
        BusinessError.NOT_FOUND,
      );

    if (this.validarCiudad(tienda.ciudad)) {
      return await this.tiendaRepository.save({
        ...persistedProducto,
        ...tienda,
      });
    }
    throw new BusinessLogicException(
      'La ciudad no cumple con el código de 3 caracteres',
      BusinessError.PRECONDITION_FAILED,
    );
  }

  async delete(id: string) {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
    });
    if (!tienda)
      throw new BusinessLogicException(
        'La tienda con el id buscado no se encontró',
        BusinessError.NOT_FOUND,
      );

    await this.tiendaRepository.remove(tienda);
  }

  validarCiudad(ciudad: string): boolean {
    if (typeof ciudad === 'string') {
      return ciudad.length === 3;
    }
    return false;
  }
}
