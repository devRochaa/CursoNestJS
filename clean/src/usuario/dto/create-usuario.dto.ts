import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

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
}
