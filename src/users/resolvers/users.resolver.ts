import { Resolver, Query, Mutation, Args, ID, ObjectType, Field } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';
import { UpdateUserInput } from '../dto/user.inputs';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { SuperAdminGuard } from '../guards/superadmin.guard';

@ObjectType()
class DeleteUserResponse {
  @Field()
  message: string;
}

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], {
    name: 'users',
    description: 'Obtener todos los usuarios (solo superadmin)',
  })
  @UseGuards(GqlAuthGuard, SuperAdminGuard)
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User, {
    name: 'user',
    description: 'Obtener un usuario por ID (solo superadmin)',
  })
  @UseGuards(GqlAuthGuard, SuperAdminGuard)
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User, {
    name: 'updateUser',
    description: 'Actualizar un usuario (solo superadmin)',
  })
  @UseGuards(GqlAuthGuard, SuperAdminGuard)
  async update(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.update(id, updateUserInput);
  }

  @Mutation(() => DeleteUserResponse, {
    name: 'deleteUser',
    description: 'Eliminar un usuario (solo superadmin)',
  })
  @UseGuards(GqlAuthGuard, SuperAdminGuard)
  async remove(@Args('id', { type: () => ID }) id: string): Promise<DeleteUserResponse> {
    return await this.usersService.remove(id);
  }
}

