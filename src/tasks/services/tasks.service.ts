import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskInput } from '../dto/task.inputs';
import { UpdateTaskInput } from '../dto/task.inputs';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createTaskInput: CreateTaskInput, user: User): Promise<Task> {
    const project = await this.projectRepository.findOne({
      where: { id: createTaskInput.projectId },
    });

    if (!project) {
      throw new NotFoundException(`Proyecto con ID ${createTaskInput.projectId} no encontrado`);
    }

    if (project.userId !== user.id && user.role !== 'superadmin') {
      throw new ForbiddenException('No tienes permiso para agregar tareas a este proyecto');
    }

    const task = this.taskRepository.create({
      ...createTaskInput,
      dueDate: createTaskInput.dueDate ? new Date(createTaskInput.dueDate) : undefined,
    });
    return await this.taskRepository.save(task);
  }

  async findAll(user: User): Promise<Task[]> {
    if (user.role === 'superadmin') {
      return await this.taskRepository.find({
        relations: ['project', 'assignedTo'],
      });
    }

    const userProjects = await this.projectRepository.find({
      where: { userId: user.id },
    });

    const projectIds = userProjects.map((p) => p.id);

    if (projectIds.length === 0) {
      return [];
    }

    return await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.assignedTo', 'assignedTo')
      .where('task.projectId IN (:...projectIds)', { projectIds })
      .getMany();
  }

  async findOne(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['project', 'assignedTo'],
    });

    if (!task) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }

    const project = await this.projectRepository.findOne({
      where: { id: task.projectId },
    });

    if (!project) {
      throw new NotFoundException(`Proyecto asociado no encontrado`);
    }

    if (project.userId !== user.id && user.role !== 'superadmin') {
      throw new ForbiddenException('No tienes permiso para ver esta tarea');
    }

    return task;
  }

  async update(id: string, updateTaskInput: UpdateTaskInput, user: User): Promise<Task> {
    const task = await this.findOne(id, user);

    const project = await this.projectRepository.findOne({
      where: { id: task.projectId },
    });

    if (!project) {
      throw new NotFoundException(`Proyecto asociado no encontrado`);
    }

    if (project.userId !== user.id && user.role !== 'superadmin') {
      throw new ForbiddenException('No tienes permiso para modificar esta tarea');
    }

    const updateData: any = {};
    
    if (updateTaskInput.title !== undefined) {
      updateData.title = updateTaskInput.title;
    }
    if (updateTaskInput.description !== undefined) {
      updateData.description = updateTaskInput.description;
    }
    if (updateTaskInput.status !== undefined) {
      updateData.status = updateTaskInput.status;
    }
    if (updateTaskInput.priority !== undefined) {
      updateData.priority = updateTaskInput.priority;
    }
    if (updateTaskInput.dueDate !== undefined) {
      updateData.dueDate = updateTaskInput.dueDate ? new Date(updateTaskInput.dueDate) : null;
    }
    if (updateTaskInput.assignedToId !== undefined) {
      updateData.assignedToId = updateTaskInput.assignedToId;
    }

    Object.assign(task, updateData);
    return await this.taskRepository.save(task);
  }

  async remove(id: string, user: User): Promise<{ message: string }> {
    const task = await this.findOne(id, user);

    const project = await this.projectRepository.findOne({
      where: { id: task.projectId },
    });

    if (!project) {
      throw new NotFoundException(`Proyecto asociado no encontrado`);
    }

    if (project.userId !== user.id && user.role !== 'superadmin') {
      throw new ForbiddenException('No tienes permiso para eliminar esta tarea');
    }

    await this.taskRepository.remove(task);
    return { message: 'Tarea eliminada correctamente' };
  }

  async findByProject(projectId: string, user: User): Promise<Task[]> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Proyecto con ID ${projectId} no encontrado`);
    }

    if (project.userId !== user.id && user.role !== 'superadmin') {
      throw new ForbiddenException('No tienes permiso para ver las tareas de este proyecto');
    }

    return await this.taskRepository.find({
      where: { projectId },
      relations: ['assignedTo'],
    });
  }
}

