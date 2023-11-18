import { Test, TestingModule } from '@nestjs/testing';
import { ProductoService } from './producto.service';
import { Repository } from 'typeorm';
import { ProductoEntity } from '../entity/producto.entity';
import { TypeOrmTestingConfig } from '../../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productoList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    productoList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await repository.save({
        nombre: faker.commerce.productName(),
        precio: faker.number.int(),
        tipo: faker.helpers.arrayElement(['Perecedero', 'No perecedero']),
      });
      productoList.push(producto);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all product', async () => {
    const productos: ProductoEntity[] = await service.findAll();
    expect(productos).not.toBeNull();
    expect(productos).toHaveLength(productoList.length);
  });

  it('findOne should return a product by id', async () => {
    const storedProduct: ProductoEntity = productoList[0];
    const product: ProductoEntity = await service.findOne(storedProduct.id);
    expect(product).not.toBeNull();
    expect(product.nombre).toEqual(storedProduct.nombre);
    expect(product.precio).toEqual(storedProduct.precio);
    expect(product.tipo).toEqual(storedProduct.tipo);
  });

  it('findOne should throw an exception for an invalid product', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El producto con el id buscado no se encontró',
    );
  });

  it('create should return a new product', async () => {
    const product: ProductoEntity = {
      id: '',
      nombre: faker.commerce.productName(),
      precio: faker.number.int(),
      tipo: faker.helpers.arrayElement(['Perecedero', 'No perecedero']),
      tiendas: [],
    };

    const newProduct: ProductoEntity = await service.create(product);
    expect(newProduct).not.toBeNull();

    const storedProduct: ProductoEntity = await repository.findOne({
      where: { id: newProduct.id },
    });
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.nombre).toEqual(newProduct.nombre);
    expect(storedProduct.precio).toEqual(newProduct.precio);
    expect(storedProduct.tipo).toEqual(newProduct.tipo);
  });

  it('update should modify a product', async () => {
    const product: ProductoEntity = productoList[0];
    product.nombre = 'New name';
    product.precio = 100;
    const updatedProduct: ProductoEntity = await service.update(
      product.id,
      product,
    );
    expect(updatedProduct).not.toBeNull();
    const storedProduct: ProductoEntity = await repository.findOne({
      where: { id: product.id },
    });
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.nombre).toEqual(product.nombre)
    expect(storedProduct.precio).toEqual(product.precio)
  });

  it('update should throw an exception for an invalid museum', async () => {
    let product: ProductoEntity = productoList[0];
    product = {
      ...product,
      nombre: 'New name',
      precio: 101,
    };
    await expect(() => service.update('0', product)).rejects.toHaveProperty(
      'message',
      'El producto con el id buscado no se encontró',
    );
  });

  it('delete should remove a product', async () => {
    const product: ProductoEntity = productoList[0];
    await service.delete(product.id);
    const deletedMuseum: ProductoEntity = await repository.findOne({
      where: { id: product.id },
    });
    expect(deletedMuseum).toBeNull();
  });

  it('delete should throw an exception for an invalid product', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El producto con el id buscado no se encontró',
    );
  });
});
