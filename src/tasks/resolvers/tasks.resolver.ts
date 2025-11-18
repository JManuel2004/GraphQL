import { Resolver, Query, Mutation, Args, ID, ObjectType, Field } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { Task } from '../entities/task.entity';
import { CreateTaskInput } from '../dto/task.inputs';
import { UpdateTaskInput } from '../dto/task.inputs';
import { User } from '../../users/entities/user.entity';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';

@ObjectType()
class DeleteTaskResponse {
  @Field()
  message: string;
}

@Resolver(() => Task)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Mutation(() => Task, {
    name: 'createTask',
    description: 'Crear una nueva tarea',
  })
  @UseGuards(GqlAuthGuard)
  async createTask(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
    @CurrentUser() user: User,
  ): Promise<Task> {
    return this.tasksService.create(createTaskInput, user);
  }

  @Query(() => [Task], {
    name: 'tasks',
    description: 'Obtener todas las tareas del usuario autenticado',
  })
  @UseGuards(GqlAuthGuard)
  async findAll(@CurrentUser() user: User): Promise<Task[]> {
    return this.tasksService.findAll(user);
  }

  @Query(() => [Task], {
    name: 'tasksByProject',
    description: 'Obtener todas las tareas de un proyecto específico',
  })
  @UseGuards(GqlAuthGuard)
  async findByProject(
    @Args('projectId', { type: () => ID }) projectId: string,
    @CurrentUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.findByProject(projectId, user);
  }

  @Query(() => Task, {
    name: 'task',
    description: 'Obtener una tarea por su ID',
  })
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<Task> {
    return this.tasksService.findOne(id, user);
  }

  @Mutation(() => Task, {
    name: 'updateTask',
    description: 'Actualizar una tarea existente',
  })
  @UseGuards(GqlAuthGuard)
  async updateTask(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateTaskInput') updateTaskInput: UpdateTaskInput,
    @CurrentUser() user: User,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskInput, user);
  }

  @Mutation(() => DeleteTaskResponse, {
    name: 'deleteTask',
    description: 'Eliminar una tarea',
  })
  @UseGuards(GqlAuthGuard)
  async remove(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<DeleteTaskResponse> {
    return await this.tasksService.remove(id, user);
  }
}

