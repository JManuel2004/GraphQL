import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../users/entities/user.entity';
import { RegisterInput, LoginInput } from './dto/auth.inputs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registrar un nuevo usuario
   */
  async register(registerInput: RegisterInput): Promise<User> {
    const { email, password, fullname, role } = registerInput;

    try {
      // Verificar si el usuario ya existe
      const existingUser = await this.userRepository.findOne({
        where: { email: email.toLowerCase().trim() },
      });

      if (existingUser) {
        throw new ConflictException('El email ya está registrado');
      }

      // Crear usuario
      const user = this.userRepository.create({
        email,
        fullname,
        role: role || UserRole.USUARIO,
        password: this.hashPassword(password),
        isActive: true,
      });

      // Guardar en BD
      await this.userRepository.save(user);

      // Eliminar password del objeto de respuesta
      delete user.password;

      this.logger.log(`Usuario registrado: ${user.email}`);
      return user;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      this.logger.error(`Error al registrar usuario: ${error.message}`);
      throw new InternalServerErrorException(
        'Error al registrar el usuario',
      );
    }
  }

  /**
   * Login de usuario
   */
  async login(loginInput: LoginInput): Promise<{ user: User; token: string }> {
    const { email, password } = loginInput;

    // Buscar usuario con password
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase().trim() },
      select: ['id', 'email', 'password', 'fullname', 'role', 'isActive'],
    });

    // Validar existencia
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Validar si está activo
    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Validar contraseña
    if (!user.password) {
      // aunque se solicitó el password en la consulta, validamos por seguridad y por el typing de TS
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Generar token
    const token = this.generateToken(user);

    // Eliminar password
    delete user.password;

    this.logger.log(`Login exitoso: ${user.email}`);

    return {
      user,
      token,
    };
  }

  /**
   * Verificar token y renovarlo
   */
  async renewToken(user: User): Promise<{ user: User; token: string }> {
    const token = this.generateToken(user);

    return {
      user,
      token,
    };
  }

  /**
   * Validar usuario por ID (usado por JWT Strategy)
   */
  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Token no válido');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    delete user.password;
    return user;
  }

  /**
   * Generar JWT token
   */
  private generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Hashear contraseña
   */
  private hashPassword(password: string): string {
    const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    return bcrypt.hashSync(password, rounds);
  }
}