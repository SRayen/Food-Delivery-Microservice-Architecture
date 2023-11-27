import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/user.dto';
import { PrismaService } from '../../../prisma/Prisma.Service';
import { Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  //Register User Service
  async register(registerDto: RegisterDto, resposne: Response) {
    const { name, password, email, phone_number } = registerDto;
    const isEmailExist = await this.prisma.user.findUnique({
      where: { email }, //rq:email must be @unique in schema.prisma
    });

    if (isEmailExist) {
      throw new BadRequestException('User already exist with this email');
    }
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    return { user, resposne };
  }

  //Login User Service
  async Login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = {
      email,
      password,
    };
    return user;
  }

  //Get all users Service
  async getUsers() {
    return this.prisma.user.findMany({});
  }
}
