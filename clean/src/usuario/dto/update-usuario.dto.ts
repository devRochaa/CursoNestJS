import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RoutePolicies } from 'src/auth/constants/enum/route-policies.enum';

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

  // @IsEnum(RoutePolicies, { each: true })
  // routePolicies: RoutePolicies[];
}
