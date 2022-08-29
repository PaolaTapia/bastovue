import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Model } from 'mongoose';
import { hash, compare, hashSync } from 'bcrypt';
import { Auth } from './entities/auth.entity';
import { InjectModel } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private readonly authModel: Model<Auth>,
    private JwtService: JwtService,
  ) {}

  async register(registerAuthDto: RegisterAuthDto) {
    const { password, repeatpassword } = registerAuthDto;
    if (password !== repeatpassword) {
      throw new Error('Las contraseñas no coinciden');
    }
    const hashedPassword = await hashSync(password, 10);
    registerAuthDto = {
      ...registerAuthDto,
      repeatpassword: null,
      password: hashedPassword,
    };

    try {
      return await this.authModel.create(registerAuthDto);
    } catch (error) {
      if (error.code === 11000) {
        this.handleExceptions(error);
      }
    }
  }

  async login(loginAuthDto: LoginAuthDto) {
    const findUser = await this.authModel.findOne({
      email: loginAuthDto.email,
    });
    if (!findUser) {
      throw new BadRequestException('Usuario no encontrado');
    }
    const isMatch = await compare(loginAuthDto.password, findUser.password);
    if (!isMatch) {
      throw new BadRequestException('Contraseña incorrecta');
    }
    const payload = {
      email: findUser.email,
      sub: findUser._id,
    };
    const token = this.JwtService.sign({
      payload,
    });
    const data = {
      user: findUser,
      token,
    };
    return data;
  }

  async findAll() {
    return await this.authModel.find({});
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `User already exists ${JSON.stringify(error.keyValue)}`,
      );
    }
    throw new InternalServerErrorException(
      'Error creating user - check server log',
    );
  }
}
