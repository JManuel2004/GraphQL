import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { UsersResolver } from './resolvers/users.resolver';
import { SuperAdminGuard } from './guards/superadmin.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UsersResolver, SuperAdminGuard],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}