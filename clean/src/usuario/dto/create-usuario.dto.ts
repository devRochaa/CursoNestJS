import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RoutePolicies } from 'src/auth/constants/enum/route-policies.enum';

export class CreateUsuarioDto {
  @MinLength(3)
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(4)
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  password: string;

  // @IsEnum(RoutePolicies, { each: true })
  // routePolicies: RoutePolicies[];
}
