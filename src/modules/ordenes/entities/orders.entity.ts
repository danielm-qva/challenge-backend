import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ApplicationSchema } from '../../application/entities/application.entity';

export type OrderSchemaDocument = HydratedDocument<OrderEntitySchema>;

@Schema({ timestamps: true })
export class OrderEntitySchema {
  @Prop({ required: true, unique: true })
  codeOrders: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: ApplicationSchema.name,
  })
  requestAssociated: mongoose.Types.ObjectId[];
}

export const OrdersSchema = SchemaFactory.createForClass(OrderEntitySchema);
