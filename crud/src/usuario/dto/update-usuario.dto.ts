import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @MinLength(3)
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @MinLength(4)
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password: string;
}
