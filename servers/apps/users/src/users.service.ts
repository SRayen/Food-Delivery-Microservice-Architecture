import { User } from './entities/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import {
  ActivationDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/user.dto';
import { PrismaService } from '../../../prisma/Prisma.Service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email/email.service';
import { TokenSender } from './utils/sendToken';

interface UserData {
  name: string;
  email: string;
  password: string;
  phone_number: number;
}

interface Payload {
  user: UserData;
  activationCode: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
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

    const isPhoneNumbertExist = await this.prisma.user.findUnique({
      where: { phone_number },
    });

    if (isPhoneNumbertExist) {
      throw new BadRequestException(
        'User already exist with this phone number',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
      phone_number,
    };

    const activationToken = await this.createActivationToken(user);
    const activationCode = activationToken.activationCode;
    const activation_token = activationToken.token;

    await this.emailService.sendMail({
      email,
      subject: 'Activate your account',
      template: './activation-mail', //related to activation-mail.ejs file
      name,
      activationCode,
    });

    return { activation_token, resposne };
  }

  //Create activation token
  async createActivationToken(user: UserData) {
    //4 digits random number
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = this.jwtService.sign(
      { user, activationCode },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '5m',
      },
    );

    return { token, activationCode };
  }

  //Activation
  // Activation
  async activateUser(activationDto: ActivationDto, response: Response) {
    const { activationCode, activationToken } = activationDto;
    let payload: Payload;

    try {
      payload = this.jwtService.verify(activationToken, {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new BadRequestException('Activation token has expired');
      }
      throw new BadRequestException('Invalid activation token');
    }

    if (payload.activationCode !== activationCode) {
      throw new BadRequestException('Invalid activation code');
    }

    const { name, email, password, phone_number } = payload.user;
    let existingUser = await this.prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new BadRequestException('User already exists with this email');
    }

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        phone_number,
      },
    });
    return { user, response };
  }

  //Login User Service
  async Login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user && (await this.comparePassword(password, user.password))) {
      const tokenSender = new TokenSender(this.configService, this.jwtService);
      return tokenSender.sendToken(user);
    } else {
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: {
          message: 'Invalid email or password',
        },
      };
    }
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  //Generate Forgot Password Link
  async generateForgotPasswordLink(user: User) {
    const forgotPasswordToken = this.jwtService.sign(
      {
        user,
      },

      {
        secret: this.configService.get<string>('FORGOT_PASSWORD_TOKEN'),
        expiresIn: '5m',
      },
    );
    return forgotPasswordToken;
  }

  //Forgot Password
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new BadRequestException('User not found with this email');
    const forgotPasswordToken = await this.generateForgotPasswordLink(user);

    const responsePasswordUrl =
      this.configService.get<string>('CLIENT_SIDE_URI') +
      `/reset-password?verify=${forgotPasswordToken}`;

    await this.emailService.sendMail({
      email,
      subject: 'Reset your Password!',
      template: './forgot-password',
      name: user.name,
      activationCode: responsePasswordUrl,
    });

    return { message: 'Your forgot password request successful' };
  }

  // Reset Password
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { password, activationToken } = resetPasswordDto;
    try {
      const decoded = await this.jwtService.verify(activationToken, {
        secret: this.configService.get<string>('FORGOT_PASSWORD_TOKEN'),
      });
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.update({
        where: {
          id: decoded.user.id,
        },
        data: {
          password: hashedPassword,
        },
      });
      return { user };
    } catch (error) {
      throw new BadRequestException('Invalid Token');
    }
  }

  //Get LoggedIn User
  async getLoggedInUser(req: any) {
    const user = req.user;
    const accessToken = req.accesstoken;
    const refreshToken = req.refreshtoken;

    return { user, accessToken, refreshToken };
  }

  //Get LoggedOut User
  async Logout(req: any) {
    req.user = null;
    req.accesstoken = null;
    req.refreshtoken = null;

    return { message: 'Logged out successfully!' };
  }

  //Get all users Service
  async getUsers() {
    return this.prisma.user.findMany({});
  }
}
