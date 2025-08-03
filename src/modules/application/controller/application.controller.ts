import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApplicationService } from '../services/application.service';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { UpdateApplicationDto } from '../dto/update-application.dto';
import { QueryRequestDto } from '../../../common/dto/QueryRequest.dto';
import { ValidationObjectId } from '../../../pipe/ValidationObjetId';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationService.create(createApplicationDto);
  }

  @Get()
  findAll(@Query() queryParams: QueryRequestDto) {
    return this.applicationService.findAll(queryParams);
  }

  @Get(':id')
  findOne(@Param('id', ValidationObjectId) id: string) {
    return this.applicationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ValidationObjectId) id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return this.applicationService.update(id, updateApplicationDto);
  }

  @Delete(':id')
  remove(@Param('id', ValidationObjectId) id: string) {
    return this.applicationService.remove(id);
  }
}
