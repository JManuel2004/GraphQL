import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from '../entities/user.entity';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    if (user.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Solo los administradores pueden realizar esta acción');
    }

    return true;
  }
}

