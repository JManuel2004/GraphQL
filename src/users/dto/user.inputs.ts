import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, IsOptional, MinLength, IsEnum, IsBoolean } from 'class-validator';
import { UserRole } from '../entities/user.entity';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  fullname?: string;

  @Field(() => UserRole, { nullable: true })
  @IsOptional()
  @IsEnum(UserRole, { message: 'El rol debe ser superadmin o usuario' })
  role?: UserRole;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

