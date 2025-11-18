import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserInput } from '../dto/user.inputs';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'email', 'fullname', 'role', 'isActive'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'fullname', 'role', 'isActive'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.findOne(id);

    const updateData: any = {};

    if (updateUserInput.email !== undefined) {
      updateData.email = updateUserInput.email.toLowerCase().trim();
    }
    if (updateUserInput.fullname !== undefined) {
      updateData.fullname = updateUserInput.fullname;
    }
    if (updateUserInput.role !== undefined) {
      updateData.role = updateUserInput.role;
    }
    if (updateUserInput.isActive !== undefined) {
      updateData.isActive = updateUserInput.isActive;
    }
    if (updateUserInput.password !== undefined) {
      const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
      updateData.password = bcrypt.hashSync(updateUserInput.password, rounds);
    }

    Object.assign(user, updateData);
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.findOne(id);
    await this.userRepository.softRemove(user);
    return { message: 'Usuario eliminado correctamente' };
  }
}

