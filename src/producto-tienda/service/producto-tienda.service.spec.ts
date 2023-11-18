import { Test, TestingModule } from '@nestjs/testing';
import { ProductoTiendaService } from './producto-tienda.service';
import { Repository } from 'typeorm';
import { ProductoEntity } from '../../producto/entity/producto.entity';
import { TiendaEntity } from '../../tienda/entity/tienda.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../../shared/testing-utils/typeorm-testing-config';

describe('TiendaProductoService', () => {
  let service: ProductoTiendaService;
  let productoRepository: Repository<ProductoEntity>;
  let tiendaRepository: Repository<TiendaEntity>;
  let productoEntity: ProductoEntity;
  let tiendaList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoTiendaService],
    }).compile();

    service = module.get<ProductoTiendaService>(ProductoTiendaService);
    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    tiendaRepository = module.get<Repository<TiendaEntity>>(
      getRepositoryToken(TiendaEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    productoRepository.clear();
    tiendaRepository.clear();

    tiendaList = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await tiendaRepository.save({
        nombre: faker.company.name(),
        ciudad: faker.location.city().substring(0, 3),
        direccion: faker.location.streetAddress(),
      });
      tiendaList.push(tienda);
    }

    productoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      precio: faker.number.int(),
      tipo: faker.helpers.arrayElement(['Perecedero', 'No perecedero']),
      tiendas: tiendaList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addStoreToProduct should add an store to a producto', async () => {
    const newStore: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.city().substring(0, 3),
      direccion: faker.location.streetAddress(),
    });

    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      precio: faker.number.int(),
      tipo: faker.helpers.arrayElement(['Perecedero', 'No perecedero']),
    });

    const result: ProductoEntity = await service.addStoreToProduct(
      newProducto.id,
      newStore.id,
    );

    expect(result.tiendas.length).toBe(1);
    expect(result.tiendas[0]).not.toBeNull();
    expect(result.tiendas[0].nombre).toBe(newStore.nombre);
    expect(result.tiendas[0].ciudad).toBe(newStore.ciudad);
    expect(result.tiendas[0].direccion).toBe(newStore.direccion);
  });

  it('addStoreToProduct should thrown exception for an invalid store', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      precio: faker.number.int(),
      tipo: faker.helpers.arrayElement(['Perecedero', 'No perecedero']),
    });

    await expect(() =>
      service.addStoreToProduct(newProducto.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'La tienda con el id no ha sido encontrada',
    );
  });

  it('addStoreToProduct should throw an exception for an invalid product', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.city().substring(0, 3),
      direccion: faker.location.streetAddress(),
    });

    await expect(() =>
      service.addStoreToProduct('0', newTienda.id),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id no se encontró',
    );
  });

  it('findStoreFromProduct should return tienda by product', async () => {
    const tienda: TiendaEntity = tiendaList[0];
    const storedTienda: TiendaEntity = await service.findStoreFromProduct(
      productoEntity.id,
      tienda.id,
    );
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toBe(tienda.nombre);
    expect(storedTienda.ciudad).toBe(tienda.ciudad);
    expect(storedTienda.direccion).toBe(tienda.direccion);
  });

  it('findStoreFromProduct should throw an exception for an invalid tienda', async () => {
    await expect(() =>
      service.findStoreFromProduct(productoEntity.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'La tienda con el id no ha sido encontrada',
    );
  });

  it('findStoreFromProduct should throw an exception for an invalid producto', async () => {
    const tienda: TiendaEntity = tiendaList[0];
    await expect(() =>
      service.findStoreFromProduct('0', tienda.id),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id no se encontró',
    );
  });

  it('findStoreFromProduct should throw an exception for an tienda not associated to the producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      id: '',
      nombre: faker.company.name(),
      ciudad: faker.location.city().substring(0, 3),
      direccion: faker.location.streetAddress(),
    });

    await expect(() =>
      service.findStoreFromProduct(productoEntity.id, newTienda.id),
    ).rejects.toHaveProperty(
      'message',
      'La tienda con el id proporcionado no esta asociada con el producto',
    );
  });

  it('findStoresFromProduct should return artworks by producto', async () => {
    const tiendas: TiendaEntity[] = await service.findStoresFromProduct(
      productoEntity.id,
    );
    expect(tiendas.length).toBe(5);
  });

  it('findStoresFromProduct should throw an exception for an invalid producto', async () => {
    await expect(() =>
      service.findStoresFromProduct('0'),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id no se encontró',
    );
  });

  it('updateStoresFromProduct should update artworks list for a productos', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.city().substring(0, 3),
      direccion: faker.location.streetAddress(),
    });

    const updatedProducto: ProductoEntity =
      await service.updateStoresFromProduct(productoEntity.id, [newTienda]);
    expect(updatedProducto.tiendas.length).toBe(1);

    expect(updatedProducto.tiendas[0].nombre).toBe(newTienda.nombre);
    expect(updatedProducto.tiendas[0].ciudad).toBe(newTienda.ciudad);
    expect(updatedProducto.tiendas[0].direccion).toBe(newTienda.direccion);
  });

  it('updatedProducto should throw an exception for an invalid producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.city().substring(0, 3),
      direccion: faker.location.streetAddress(),
    });

    await expect(() =>
      service.updateStoresFromProduct('0', [newTienda]),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id no se encontró',
    );
  });

  it('updateStoresFromProduct should throw an exception for an invalid tienda', async () => {
    const newTienda: TiendaEntity = tiendaList[0];
    newTienda.id = '';

    await expect(() =>
      service.updateStoresFromProduct(productoEntity.id, [newTienda]),
    ).rejects.toHaveProperty(
      'message',
      'La tienda con el id no ha sido encontrada',
    );
  });

  it('deleteStoreFromProduct should remove an tienda from a producto', async () => {
    const tienda: TiendaEntity = tiendaList[0];

    await service.deleteStoreFromProduct(productoEntity.id, tienda.id);

    const storedProducto: ProductoEntity = await productoRepository.findOne({
      where: { id: productoEntity.id },
      relations: ['tiendas'],
    });
    const deletedTienda: TiendaEntity = storedProducto.tiendas.find(
      (a) => a.id === tienda.id,
    );

    expect(deletedTienda).toBeUndefined();
  });

  it('deleteStoreFromProduct should thrown an exception for an invalid artwork', async () => {
    await expect(() =>
      service.deleteStoreFromProduct(productoEntity.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'La tienda con el id no ha sido encontrada',
    );
  });

  it('deleteStoreFromProduct should thrown an exception for an invalid producto', async () => {
    const tienda: TiendaEntity = tiendaList[0];
    await expect(() =>
      service.deleteStoreFromProduct('0', tienda.id),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id no se encontró',
    );
  });

  it('deleteStoreFromProduct should thrown an exception for an non asocciated tienda', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.city().substring(0, 3),
      direccion: faker.location.streetAddress(),
    });

    await expect(() =>
      service.deleteStoreFromProduct(productoEntity.id, newTienda.id),
    ).rejects.toHaveProperty(
      'message',
      'La tienda con el id proporcionado no esta asociada con el producto',
    );
  });
});
