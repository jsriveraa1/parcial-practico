import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductoDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsNumber()
  @IsNotEmpty()
  readonly precio: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Perecedero', 'No perecedero'], {
    message:
      'El tipo de producto proporcionado no es valido. Recuerde que los valores validos son: Perecedero y No perecedero',
  })
  readonly tipo: string;
}
