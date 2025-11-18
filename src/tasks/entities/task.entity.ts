import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  description: 'Estados disponibles para tareas',
});

registerEnumType(TaskPriority, {
  name: 'TaskPriority',
  description: 'Prioridades disponibles para tareas',
});

@ObjectType()
@Entity()
export class Task {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({
    type: 'text',
    nullable: false,
  })
  title: string;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Field(() => TaskStatus)
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Field(() => TaskPriority)
  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Field({ nullable: true })
  @Column({
    type: 'timestamp',
    nullable: true,
  })
  dueDate?: Date;

  @Field(() => Project, { nullable: true })
  @ManyToOne(() => Project, (project) => project.tasks, { eager: false, onDelete: 'CASCADE' })
  project?: Project;

  @Column()
  projectId: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.assignedTasks, { eager: false, nullable: true })
  assignedTo?: User;

  @Column({ nullable: true })
  assignedToId?: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}

