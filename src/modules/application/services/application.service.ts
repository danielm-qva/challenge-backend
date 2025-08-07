import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { UpdateApplicationDto } from '../dto/update-application.dto';
import {
  ApplicationDocument,
  ApplicationSchema,
} from '../entities/application.entity';
import { QueryRequestDto } from '../../../common/dto/QueryRequest.dto';
import {
  getPrefTypeDocument,
  parseDate,
} from '../utils/getPrefijoTypeDocument';
import { RedisIndexService } from './redis-index.service';
import {
  OrderEntitySchema,
  OrderSchemaDocument,
} from '../../ordenes/entities/orders.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(ApplicationSchema.name)
    private readonly applicationModel: Model<ApplicationDocument>,
    private readonly redisIndexService: RedisIndexService,
    @InjectModel(OrderEntitySchema.name)
    private readonly orderModel: Model<OrderSchemaDocument>,
  ) {}

  async create(createDto: CreateApplicationDto) {
    try {
      const pref = getPrefTypeDocument(createDto.type);
      const dateParse = parseDate();

      // TODO Verificamos si existe una orden, si existe la actualizamos, si no la creamos.
      const redisKey = `application:index:${pref}${dateParse}`;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const index = await this.redisIndexService.getNextIndex(redisKey);
      const code = `S${String(index).padStart(2, '0')}`;
      const associatedApplication = await this.applicationModel.create({
        ...createDto,
        code,
      });

      let order = await this.orderModel
        .updateOne(
          {
            prefixOrders: `${pref}${dateParse}`,
            count: { $lt: 50 },
          },
          {
            $push: { requestAssociated: associatedApplication._id },
            $inc: { count: 1 },
          },
          { upsert: true },
        )
        .exec();

      if (order) {
        if (order?.upsertedCount === 1) {
          const indexOrder = await this.redisIndexService.getNextIndex(
            `order:index:${pref}`,
            'order',
          );
          const codeOrders = `${pref}${dateParse}${String(indexOrder).padStart(3, '0')}`;

          if (
            (indexOrder as number) ===
            +(process.env.NEST_LIMIT_ORDER_DAY || 1000)
          ) {
            throw new HttpException(
              'It is not possible to create more orders.',
              HttpStatus.BAD_REQUEST,
            );
          }

          await this.orderModel
            .updateOne(
              {
                _id: order.upsertedId,
              },
              {
                $set: { codeOrders },
              },
            )
            .exec();
        }
      }

      return associatedApplication;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // async create(createDto: CreateApplicationDto) {
  //   // const session = await this.applicationModel.startSession();
  //   // session.startTransaction();
  //
  //   try {
  //     const pref = getPrefTypeDocument(createDto.type);
  //     const dateParse = parseDate();
  //
  //     // TODO Verificamos si existe una orden, si existe la actualizamos, si no la creamos.
  //     const order = await this.orderModel
  //       .findOne({
  //         codeOrders: new RegExp(`^${pref}${dateParse}`),
  //         $expr: { $lt: [{ $size: '$requestAssociated' }, 50] },
  //       })
  //       .sort({ createdAt: -1 })
  //       .exec();
  //
  //     const redisKey = `application:index:${pref}${dateParse}`;
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //     const index = await this.redisIndexService.getNextIndex(redisKey);
  //     const code = `S${String(index).padStart(2, '0')}`;
  //     const associatedApplication = await this.applicationModel.create({
  //       ...createDto,
  //       code,
  //     });
  //
  //     if (order) {
  //       try {
  //         await this.orderModel.updateOne(
  //           { _id: order._id },
  //           { $push: { requestAssociated: associatedApplication._id } },
  //         );
  //       } catch (error) {
  //         throw new HttpException(
  //           'We were unable to associate the document with your order.',
  //           HttpStatus.BAD_REQUEST,
  //         );
  //       }
  //     } else {
  //       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //       const indexOrder = await this.redisIndexService.getNextIndex(
  //         `order:index:${pref}`,
  //         'order',
  //       );
  //       const codeOrders = `${pref}${dateParse}${String(indexOrder).padStart(3, '0')}`;
  //
  //       if (
  //         (indexOrder as number) === +(process.env.NEST_LIMIT_ORDER_DAY || 1000)
  //       ) {
  //         throw new HttpException(
  //           'It is not possible to create more orders.',
  //           HttpStatus.BAD_REQUEST,
  //         );
  //       }
  //
  //       try {
  //         await this.orderModel.create({
  //           codeOrders,
  //           requestAssociated: [associatedApplication._id],
  //         });
  //       } catch (error) {
  //         // TODO puede fallar la ordern, se va a crear una solicitud sin estar asociada a ninguna orden.
  //         throw new HttpException(
  //           'We were unable to create the order',
  //           HttpStatus.BAD_REQUEST,
  //         );
  //       }
  //     }
  //     return associatedApplication;
  //   } catch (error) {
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  findAll({ page, size }: QueryRequestDto) {
    return this.applicationModel
      .find()
      .setOptions({ sanitizeFilter: true })
      .skip((page - 1) * size)
      .limit(size)
      .exec();
  }

  async findOne(id: string) {
    const application = await this.applicationModel.findById(id).exec();
    if (!application) {
      throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
    }
    return application;
  }

  async update(id: string, updateDto: UpdateApplicationDto) {
    const updated = await this.applicationModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updated) {
      throw new HttpException(
        'The request could not be updated',
        HttpStatus.NOT_FOUND,
      );
    }
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.applicationModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new HttpException('Request was not deleted', HttpStatus.NOT_FOUND);
    }
    return deleted;
  }
}
