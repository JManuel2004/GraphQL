import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID, IsDateString } from 'class-validator';
import { TaskStatus, TaskPriority } from '../entities/task.entity';

@InputType()
export class CreateTaskInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'El título es requerido' })
  title: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => TaskStatus, { nullable: true })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'El estado debe ser pending, in-progress, completed o cancelled' })
  status?: TaskStatus;

  @Field(() => TaskPriority, { nullable: true })
  @IsOptional()
  @IsEnum(TaskPriority, { message: 'La prioridad debe ser low, medium o high' })
  priority?: TaskPriority;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe ser válida' })
  dueDate?: string;

  @Field()
  @IsUUID('4', { message: 'El ID del proyecto debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del proyecto es requerido' })
  projectId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del usuario asignado debe ser un UUID válido' })
  assignedToId?: string;
}

@InputType()
export class UpdateTaskInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => TaskStatus, { nullable: true })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'El estado debe ser pending, in-progress, completed o cancelled' })
  status?: TaskStatus;

  @Field(() => TaskPriority, { nullable: true })
  @IsOptional()
  @IsEnum(TaskPriority, { message: 'La prioridad debe ser low, medium o high' })
  priority?: TaskPriority;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe ser válida' })
  dueDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del usuario asignado debe ser un UUID válido' })
  assignedToId?: string;
}

