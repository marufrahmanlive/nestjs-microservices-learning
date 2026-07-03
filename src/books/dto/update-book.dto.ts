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
 * 📝 UpdateBookDto — DTO for updating a book
 *
 * WHY every field is @IsOptional()?
 * When updating, the user might send ONLY the fields they want to change.
 * For example: only { "title": "New Title" } without author, year, etc.
 *
 * In a production app, you'd use PartialType() from @nestjs/mapped-types
 * to automatically make all fields optional. But to keep things simple
 * and avoid extra dependencies, we list them explicitly here.
 */
export class UpdateBookDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  author?: string;

  @IsOptional()
  @IsNumber()
  @Min(1000)
  @Max(new Date().getFullYear())
  year?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
