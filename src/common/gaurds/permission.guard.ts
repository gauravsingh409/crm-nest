import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      ctx.getHandler(),
    );

    if (!requiredPermissions) return true;

    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return false;

    const userPermissions = user.roles.flatMap((ur) =>
      ur.role.permissions.map((rp) => rp.permission.name),
    );

    return requiredPermissions.every((p) => userPermissions.includes(p));
  }
}
