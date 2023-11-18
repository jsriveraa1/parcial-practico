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
  @IsIn(['Perecedero', 'No perecedero'])
  readonly tipo: string;
}
