import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsPositive, IsString, Max } from 'class-validator';

export class PaginationQueryDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Max(100)
  @IsOptional()
  limit: number = 20;

  @IsString()
  @IsOptional()
  sortBy: string = 'createdAt';

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  sortDir: 'ASC' | 'DESC' = 'DESC';
}
