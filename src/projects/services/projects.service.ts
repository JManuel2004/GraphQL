import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { CreateProjectInput } from '../dto/project.inputs';
import { UpdateProjectInput } from '../dto/project.inputs';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createProjectInput: CreateProjectInput, user: User): Promise<Project> {
    const project = this.projectRepository.create({
      ...createProjectInput,
      userId: user.id,
    });
    return await this.projectRepository.save(project);
  }

  async findAll(user: User): Promise<Project[]> {
    if (user.role === 'superadmin') {
      return await this.projectRepository.find({ relations: ['user'] });
    }
    return await this.projectRepository.find({
      where: { userId: user.id },
      relations: ['user'],
    });
  }

  async findOne(id: string, user: User): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!project) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }

    if (project.userId !== user.id && user.role !== 'superadmin') {
      throw new ForbiddenException('No tienes permiso para ver este proyecto');
    }

    return project;
  }

  async update(id: string, updateProjectInput: UpdateProjectInput, user: User): Promise<Project> {
    const project = await this.findOne(id, user);

    if (project.userId !== user.id && user.role !== 'superadmin') {
      throw new ForbiddenException('No tienes permiso para modificar este proyecto');
    }

    const updateData: any = {};
    
    if (updateProjectInput.title !== undefined) {
      updateData.title = updateProjectInput.title;
    }
    if (updateProjectInput.description !== undefined) {
      updateData.description = updateProjectInput.description;
    }
    if (updateProjectInput.status !== undefined) {
      updateData.status = updateProjectInput.status;
    }

    await this.projectRepository.update(id, updateData);
    const updatedProject = await this.projectRepository.findOne({ 
      where: { id }, 
      relations: ['user'] 
    });
    
    if (!updatedProject) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }
    
    return updatedProject;
  }

  async remove(id: string, user: User): Promise<{ message: string }> {
    const project = await this.findOne(id, user);

    if (project.userId !== user.id && user.role !== 'superadmin') {
      throw new ForbiddenException('No tienes permiso para eliminar este proyecto');
    }

    await this.projectRepository.remove(project);
    return { message: 'Proyecto eliminado correctamente' };
  }
}

