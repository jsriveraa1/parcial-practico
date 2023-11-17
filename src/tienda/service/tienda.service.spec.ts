import { Test, TestingModule } from "@nestjs/testing";
import { TiendaService } from "./tienda.service";
import { Repository } from "typeorm";
import { TiendaEntity } from "../entity/tienda.entity";
import { TypeOrmTestingConfig } from "../../shared/testing-utils/typeorm-testing-config";
import { getRepositoryToken } from "@nestjs/typeorm";
import { faker } from "@faker-js/faker";

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
  let tiendaList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(
      getRepositoryToken(TiendaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    tiendaList = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await repository.save({
        nombre: faker.company.name(),
        ciudad: faker.location.city().substring(0, 3),
        direccion: faker.location.streetAddress(),
      });
      tiendaList.push(tienda);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all tienda', async () => {
    const tienda: TiendaEntity[] = await service.findAll();
    expect(tienda).not.toBeNull();
    expect(tienda).toHaveLength(tiendaList.length);
  });

  it('findOne should return a tienda by id', async () => {
    const storedTienda: TiendaEntity = tiendaList[0];
    const tienda: TiendaEntity = await service.findOne(storedTienda.id);
    expect(tienda).not.toBeNull();
    expect(tienda.nombre).toEqual(storedTienda.nombre);
    expect(tienda.ciudad).toEqual(storedTienda.ciudad);
    expect(tienda.direccion).toEqual(storedTienda.direccion);
  });

  it('findOne should throw an exception for an invalid tienda', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'La tienda con el id buscado no se encontró',
    );
  });

  it('create should return a new tienda', async () => {
    const tienda: TiendaEntity = {
      id: '',
      nombre: faker.company.name(),
      ciudad: faker.location.city().substring(0, 3),
      direccion: faker.location.streetAddress(),
      productos: [],
    };

    const newTienda: TiendaEntity = await service.create(tienda);
    expect(newTienda).not.toBeNull();

    const storedTienda: TiendaEntity = await repository.findOne({
      where: { id: newTienda.id },
    });
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toEqual(newTienda.nombre);
    expect(storedTienda.direccion).toEqual(newTienda.direccion);
    expect(storedTienda.ciudad).toEqual(newTienda.ciudad);
  });

  it('update should modify a tienda', async () => {
    const tienda: TiendaEntity = tiendaList[0];
    tienda.nombre = 'New name';
    tienda.direccion = 'New direction';
    const updatedTienda: TiendaEntity = await service.update(tienda.id, tienda);
    expect(updatedTienda).not.toBeNull();
    const storedTienda: TiendaEntity = await repository.findOne({
      where: { id: tienda.id },
    });
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toEqual(tienda.nombre);
    expect(storedTienda.ciudad).toEqual(tienda.ciudad);
    expect(storedTienda.direccion).toEqual(tienda.direccion);
  });

  it('update should throw an exception for an invalid museum', async () => {
    let tienda: TiendaEntity = tiendaList[0];
    tienda = {
      ...tienda,
      nombre: 'New name',
      direccion: 'New direction',
    };
    await expect(() => service.update('0', tienda)).rejects.toHaveProperty(
      'message',
      'La tienda con el id buscado no se encontró',
    );
  });

  it('delete should remove a tienda', async () => {
    const tienda: TiendaEntity = tiendaList[0];
    await service.delete(tienda.id);
    const deletedTienda: TiendaEntity = await repository.findOne({
      where: { id: tienda.id },
    });
    expect(deletedTienda).toBeNull();
  });

  it('delete should throw an exception for an invalid tienda', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'La tienda con el id buscado no se encontró',
    );
  });
});
