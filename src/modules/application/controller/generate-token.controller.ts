import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('generate-token')
export class GenerateTokenController {
  constructor(private readonly jwtService: JwtService) {}

  @Post()
  create(@Body() loginDto: LoginDto) {
    return this.jwtService.sign({
      name: loginDto.name,
      base_url: loginDto.base_url,
    });
  }
}
