import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthResponse, MessageResponse } from '../types/auth-response.type';
import { RegisterInput, LoginInput } from '../dto/auth.inputs';
import { User } from '../../users/entities/user.entity';
import { CurrentUser } from '../decorators/current-user.decorator';
import { GqlAuthGuard } from '../guards/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  /**
   * Mutation: Registrar un nuevo usuario
   */
  @Mutation(() => User, {
    name: 'register',
    description: 'Registrar un nuevo usuario en el sistema',
  })
  async register(
    @Args('registerInput') registerInput: RegisterInput,
  ): Promise<User> {
    return this.authService.register(registerInput);
  }

  /**
   * Mutation: Login de usuario
   */
  @Mutation(() => AuthResponse, {
    name: 'login',
    description: 'Iniciar sesión y obtener token JWT',
  })
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<AuthResponse> {
    const { user, token } = await this.authService.login(loginInput);
    return { user, token };
  }

  /**
   * Query: Verificar token y renovarlo
   */
  @Query(() => AuthResponse, {
    name: 'renewToken',
    description: 'Verificar token actual y obtener uno nuevo',
  })
  @UseGuards(GqlAuthGuard)
  async renewToken(@CurrentUser() user: User): Promise<AuthResponse> {
    const result = await this.authService.renewToken(user);
    return result;
  }

  /**
   * Query: Obtener usuario actual autenticado
   */
  @Query(() => User, {
    name: 'me',
    description: 'Obtener información del usuario autenticado',
  })
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  /**
   * Mutation: Logout (del lado del cliente)
   */
  @Mutation(() => MessageResponse, {
    name: 'logout',
    description: 'Cerrar sesión (eliminar token del lado del cliente)',
  })
  @UseGuards(GqlAuthGuard)
  async logout(): Promise<MessageResponse> {
    return {
      message: 'Sesión cerrada correctamente. Elimina el token del cliente.',
    };
  }
}