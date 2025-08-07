import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TraceDocument = HydratedDocument<Trace>;

@Schema({ timestamps: true })
export class Trace {
  @Prop({ required: true })
  domine: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  path: string;
}

export const TranceSchemaModel = SchemaFactory.createForClass(Trace);
