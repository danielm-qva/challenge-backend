import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type ApplicationDocument = HydratedDocument<ApplicationSchema>;

@Schema({ timestamps: true })
export class ApplicationSchema {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({
    required: true,
    enum: ['Passaport', 'DNI', 'Accreditation'],
  })
  type: string;

  @Prop({
    required: true,
    enum: ['snapshot', 'batch'],
  })
  typeNotification: string;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  metadata: Record<string, any>;
}

export const ApplicationSchemaModel =
  SchemaFactory.createForClass(ApplicationSchema);
