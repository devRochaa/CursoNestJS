import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  @IsInt()
  limit: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @IsInt()
  offset: number;
}
