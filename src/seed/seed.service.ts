import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { Project, ProjectStatus } from '../projects/entities/project.entity';
import { Task, TaskStatus, TaskPriority } from '../tasks/entities/task.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('SeedService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const users = await this.insertUsers();
    const projects = await this.insertProjects(users);
    const tasks = await this.insertTasks(projects, users);

    this.logger.log('Seed ejecutado correctamente');

    return {
      message: 'Seed ejecutado exitosamente',
      data: {
        users: users.length,
        projects: projects.length,
        tasks: tasks.length,
      },
    };
  }

  private async deleteTables() {
    await this.taskRepository.query('TRUNCATE TABLE "task" CASCADE;');
    await this.projectRepository.query('TRUNCATE TABLE "project" CASCADE;');
    await this.userRepository.query('TRUNCATE TABLE "user" CASCADE;');

    this.logger.log('Tablas limpiadas');
  }

  private async insertUsers(): Promise<User[]> {
    const seedUsers = [
      {
        email: 'admin@example.com',
        password: this.hashPassword('Admin123!'),
        fullname: 'Administrador del Sistema',
        role: UserRole.SUPERADMIN,
        isActive: true,
      },
      {
        email: 'usuario1@example.com',
        password: this.hashPassword('User123!'),
        fullname: 'Usuario Uno',
        role: UserRole.USUARIO,
        isActive: true,
      },
      {
        email: 'usuario2@example.com',
        password: this.hashPassword('User123!'),
        fullname: 'Usuario Dos',
        role: UserRole.USUARIO,
        isActive: true,
      },
      {
        email: 'usuario3@example.com',
        password: this.hashPassword('User123!'),
        fullname: 'Usuario Tres',
        role: UserRole.USUARIO,
        isActive: true,
      },
    ];

    const users = this.userRepository.create(seedUsers);
    const savedUsers = await this.userRepository.save(users);

    this.logger.log(`${savedUsers.length} usuarios creados`);
    return savedUsers;
  }

  private async insertProjects(users: User[]): Promise<Project[]> {
    const admin = users.find((u) => u.role === UserRole.SUPERADMIN);
    const user1 = users.find((u) => u.email === 'usuario1@example.com');
    const user2 = users.find((u) => u.email === 'usuario2@example.com');

    if (!admin || !user1 || !user2) {
      throw new Error('No se encontraron los usuarios necesarios para crear proyectos');
    }

    const seedProjects = [
      {
        title: 'Sistema de Gestión de Proyectos',
        description: 'Desarrollo de un sistema para gestionar proyectos y tareas',
        status: ProjectStatus.IN_PROGRESS,
        userId: admin.id,
      },
      {
        title: 'Aplicación Móvil de Ventas',
        description: 'App móvil para gestión de ventas en campo',
        status: ProjectStatus.PENDING,
        userId: user1.id,
      },
      {
        title: 'Portal Web Corporativo',
        description: 'Sitio web institucional con sección de noticias y eventos',
        status: ProjectStatus.IN_PROGRESS,
        userId: user1.id,
      },
      {
        title: 'API de Integración',
        description: 'API REST para integración con sistemas externos',
        status: ProjectStatus.COMPLETED,
        userId: user2.id,
      },
    ];

    const projects = this.projectRepository.create(seedProjects);
    const savedProjects = await this.projectRepository.save(projects);

    this.logger.log(`${savedProjects.length} proyectos creados`);
    return savedProjects;
  }

  private async insertTasks(projects: Project[], users: User[]): Promise<Task[]> {
    const user1 = users.find((u) => u.email === 'usuario1@example.com');
    const user2 = users.find((u) => u.email === 'usuario2@example.com');

    if (!user1 || !user2) {
      throw new Error('No se encontraron los usuarios necesarios para crear tareas');
    }

    const seedTasks = [
      {
        title: 'Diseñar base de datos',
        description: 'Crear modelo entidad-relación y esquema de BD',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        projectId: projects[0].id,
        assignedToId: user1.id,
        dueDate: new Date('2025-11-01'),
      },
      {
        title: 'Desarrollar API REST',
        description: 'Implementar endpoints de usuarios, proyectos y tareas',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        projectId: projects[0].id,
        assignedToId: user1.id,
        dueDate: new Date('2025-11-15'),
      },
      {
        title: 'Crear interfaz de usuario',
        description: 'Diseñar y desarrollar frontend con React',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        projectId: projects[0].id,
        assignedToId: user2.id,
        dueDate: new Date('2025-12-01'),
      },
      {
        title: 'Investigar tecnologías móviles',
        description: 'Evaluar React Native vs Flutter',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.MEDIUM,
        projectId: projects[1].id,
        assignedToId: user1.id,
        dueDate: new Date('2025-10-20'),
      },
      {
        title: 'Crear wireframes',
        description: 'Diseñar mockups de las pantallas principales',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
        projectId: projects[1].id,
        assignedToId: user1.id,
        dueDate: new Date('2025-11-05'),
      },
      {
        title: 'Configurar CMS',
        description: 'Instalar y configurar sistema de gestión de contenidos',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        projectId: projects[2].id,
        assignedToId: user1.id,
        dueDate: new Date('2025-11-10'),
      },
      {
        title: 'Diseñar home page',
        description: 'Crear diseño responsive de la página principal',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        projectId: projects[2].id,
        assignedToId: user2.id,
        dueDate: new Date('2025-11-20'),
      },
      {
        title: 'Documentar endpoints',
        description: 'Crear documentación OpenAPI/Swagger',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.LOW,
        projectId: projects[3].id,
        assignedToId: user2.id,
        dueDate: new Date('2025-10-15'),
      },
    ];

    const tasks = this.taskRepository.create(seedTasks);
    const savedTasks = await this.taskRepository.save(tasks);

    this.logger.log(`${savedTasks.length} tareas creadas`);
    return savedTasks;
  }

  private hashPassword(password: string): string {
    const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    return bcrypt.hashSync(password, rounds);
  }
}

