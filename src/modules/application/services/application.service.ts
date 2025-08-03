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
    // const session = await this.applicationModel.startSession();
    // session.startTransaction();

    try {
      // TODO creamos la solicitud.
      const pref = getPrefTypeDocument(createDto.type);
      const dateParse = parseDate();
      const redisKey = `application:index:${pref}${dateParse}`;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const index = await this.redisIndexService.getNextIndex(redisKey);
      const codeRequest = `S${String(index).padStart(2, '0')}`;
      const associatedApplication = await this.applicationModel.create({
        ...createDto,
        code: codeRequest,
      });

      if (associatedApplication) {
        // TODO comprobar si no existe una orden ya creada
        const order = await this.orderModel
          .findOne({
            codeOrders: new RegExp(`^${pref}${dateParse}`),
            $expr: { $lt: [{ $size: '$requestAssociated' }, 50] },
          })
          .sort({ createdAt: -1 })
          .exec();
        // TODO si existe update los documentos asociados a esta orden
        if (order) {
          order.requestAssociated.push(associatedApplication._id);
          await order.save();
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const index = await this.redisIndexService.getNextIndex(
            `order:index:${pref}`,
            'order',
          );
          const codeOrders = `${pref}${dateParse}${String(index).padStart(3, '0')}`;
          try {
            await this.orderModel.create({
              codeOrders,
              requestAssociated: [associatedApplication._id],
            });
          } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
          }
        }
        return associatedApplication;
      }
      return new HttpException(
        'We were unable to create the request.',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

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
      throw new HttpException('Solicitud no encontrada', HttpStatus.NOT_FOUND);
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
