import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserInput, UpdateUserInput } from '../dto/user.inputs';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Crear un nuevo usuario (solo superadmin)
   */
  async create(createUserInput: CreateUserInput): Promise<User> {
    const { email, password, role = UserRole.USUARIO, ...userData } = createUserInput;

    try {
      // Verificar si el email ya existe
      const existingUser = await this.userRepository.findOne({
        where: { email: email.toLowerCase().trim() },
      });

      if (existingUser) {
        throw new ConflictException('El email ya está registrado');
      }

      // Crear usuario
      const user = this.userRepository.create({
        ...userData,
        email,
        role,
        password: this.hashPassword(password),
        isActive: true,
      });

      await this.userRepository.save(user);
      delete user.password;

      this.logger.log(`Usuario creado por admin: ${user.email}`);
      return user;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Error al crear usuario: ${error.message}`);
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }

  /**
   * Obtener todos los usuarios
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      order: { email: 'ASC' },
    });
  }

  /**
   * Obtener un usuario por ID
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  /**
   * Actualizar un usuario (solo superadmin)
   */
  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.findOne(id);

    // Si se actualiza el password, hashearlo
    if (updateUserInput.password) {
      updateUserInput.password = this.hashPassword(updateUserInput.password);
    }

    // Si se actualiza el email, verificar que no exista
    if (updateUserInput.email && updateUserInput.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserInput.email.toLowerCase().trim() },
      });

      if (existingUser) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    // Actualizar usuario
    Object.assign(user, updateUserInput);

    await this.userRepository.save(user);
    delete user.password;

    this.logger.log(`Usuario actualizado: ${user.email}`);
    return user;
  }

  /**
   * Eliminar un usuario (solo superadmin)
   */
  async remove(id: string): Promise<{ message: string }> {
    const user = await this.findOne(id);

    await this.userRepository.remove(user);

    this.logger.log(`Usuario eliminado: ${user.email}`);
    return { message: 'Usuario eliminado exitosamente' };
  }

  /**
   * Hashear contraseña
   */
  private hashPassword(password: string): string {
    const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    return bcrypt.hashSync(password, rounds);
  }
}