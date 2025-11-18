import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Task } from '../../tasks/entities/task.entity';


export enum UserRole {
  SUPERADMIN = 'superadmin',
  USUARIO = 'usuario',
}


registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Roles disponibles para usuarios',
});

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({
    type: 'text',
    unique: true,
    nullable: false,
  })
  email: string;

  
  @Column({
    type: 'text',
    nullable: false,
  })
  password?: string;

  @Field()
  @Column({
    type: 'text',
  })
  fullname: string;

  @Field(() => UserRole)
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USUARIO,
  })
  role: UserRole;

  @Field()
  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Field(() => [Project], { nullable: true })
  @OneToMany(() => Project, (project) => project.user)
  projects?: Project[];

  @Field(() => [Task], { nullable: true })
  @OneToMany(() => Task, (task) => task.assignedTo)
  assignedTasks?: Task[];

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail() {
    if (typeof this.email === 'string') {
      this.email = this.email.toLowerCase().trim();
    }
  }
}