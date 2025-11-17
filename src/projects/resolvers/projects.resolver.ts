import { Resolver, Query, Mutation, Args, ID, ObjectType, Field } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { Project } from '../entities/project.entity';
import { CreateProjectInput } from '../dto/project.inputs';
import { UpdateProjectInput } from '../dto/project.inputs';
import { User } from '../../users/entities/user.entity';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';

@ObjectType()
class DeleteProjectResponse {
  @Field()
  message: string;
}

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

 
  @Mutation(() => Project, {
    name: 'createProject',
    description: 'Crear un nuevo proyecto',
  })
  @UseGuards(GqlAuthGuard)
  async createProject(
    @Args('createProjectInput') createProjectInput: CreateProjectInput,
    @CurrentUser() user: User,
  ): Promise<Project> {
    return this.projectsService.create(createProjectInput, user);
  }

  
  @Query(() => [Project], {
    name: 'projects',
    description: 'Obtener todos los proyectos del usuario autenticado',
  })
  @UseGuards(GqlAuthGuard)
  async findAll(@CurrentUser() user: User): Promise<Project[]> {
    return this.projectsService.findAll(user);
  }

  @Query(() => Project, {
    name: 'project',
    description: 'Obtener un proyecto por su ID',
  })
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<Project> {
    return this.projectsService.findOne(id, user);
  }

  @Mutation(() => Project, {
    name: 'updateProject',
    description: 'Actualizar un proyecto existente',
  })
  @UseGuards(GqlAuthGuard)
  async updateProject(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateProjectInput') updateProjectInput: UpdateProjectInput,
    @CurrentUser() user: User,
  ): Promise<Project> {
    return this.projectsService.update(id, updateProjectInput, user);
  }

  @Mutation(() => DeleteProjectResponse, {
    name: 'deleteProject',
    description: 'Eliminar un proyecto',
  })
  @UseGuards(GqlAuthGuard)
  async remove(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<DeleteProjectResponse> {
    return await this.projectsService.remove(id, user);
  }
}

