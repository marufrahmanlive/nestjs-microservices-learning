import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

/**
 * 📥 CreateBookDto — Data Transfer Object for creating a book
 *
 * WHY use DTOs?
 * 1. VALIDATION — "title" must be a string, "year" must be a number
 * 2. DOCUMENTATION — anyone reading this code knows exactly what fields are expected
 * 3. SECURITY — only whitelisted fields pass through (no injection of extra fields)
 * 4. TYPE SAFETY — TypeScript knows the shape of request bodies
 *
 * Each decorator below is a VALIDATION RULE:
 * - @IsString() → must be text
 * - @IsNotEmpty() → can't be empty string
 * - @IsNumber() → must be a number
 * - @Min() / @Max() → number range
 * - @IsOptional() → field is not required
 */
export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  author: string;

  @IsNumber()
  @Min(1000)
  @Max(new Date().getFullYear())
  year: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
