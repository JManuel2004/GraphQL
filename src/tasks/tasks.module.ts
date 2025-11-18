import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './services/tasks.service';
import { TasksResolver } from './resolvers/tasks.resolver';
import { Task } from './entities/task.entity';
import { Project } from '../projects/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Project])],
  providers: [TasksService, TasksResolver],
  exports: [TasksService],
})
export class TasksModule {}

