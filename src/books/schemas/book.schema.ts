import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * 📖 Book Schema
 *
 * WHY a Schema?
 * MongoDB is schemaless by default — you can store ANY shape of data.
 * But in a real app, you WANT structure. Mongoose schemas define:
 * - What fields exist
 * - What TYPE each field is
 * - Which fields are REQUIRED
 * - Any validation rules
 *
 * This is like defining the columns of a SQL table,
 * but for a NoSQL database.
 */

// BookDocument is the TypeScript type that includes both
// our Book properties AND Mongoose document methods (like .save(), .findById())
export type BookDocument = Book & Document;

@Schema({
  // WHY timestamps?
  // Automatically adds createdAt and updatedAt fields.
  // We don't have to manage these manually!
  timestamps: true,
})
export class Book {
  @Prop({
    required: true,
    trim: true,
  })
  title: string;

  @Prop({
    required: true,
    trim: true,
  })
  author: string;

  @Prop({
    required: true,
    min: 1000,
    max: new Date().getFullYear(),
  })
  year: number;

  @Prop({
    trim: true,
    default: '',
  })
  description: string;
}

// SchemaFactory creates the actual Mongoose schema object
// that we register in our module
export const BookSchema = SchemaFactory.createForClass(Book);
