import { IsDate, IsIn, IsInt, IsOptional, IsString, Min, } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Pagination DTO
 * @description Pagination DTO for API requests
 * @property {number} page - Page number
 * @property {number} limit - Number of items per page
 * @property {string} search - Search query
 * @property {string} sortBy - Sort by field
 * @property {string} order - Sort order
 * @property {Date} startDate - Start date
 * @property {Date} endDate - End date
 * @property {Date} date - Exact date
 */
export class PaginationDto {

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;
}
