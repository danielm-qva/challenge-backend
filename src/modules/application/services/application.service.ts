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

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(ApplicationSchema.name)
    private readonly applicationModel: Model<ApplicationDocument>,
  ) {}

  async create(createDto: CreateApplicationDto) {
    try {
      const code = 'S1';
      return await this.applicationModel.create({ ...createDto, code });
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
