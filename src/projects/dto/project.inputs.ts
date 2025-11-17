import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';

@InputType()
export class CreateProjectInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'El título es requerido' })
  title: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => ProjectStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ProjectStatus, { message: 'El estado debe ser pending, in-progress o completed' })
  status?: ProjectStatus;
}

@InputType()
export class UpdateProjectInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => ProjectStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ProjectStatus, { message: 'El estado debe ser pending, in-progress o completed' })
  status?: ProjectStatus;
}

