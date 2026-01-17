import { SetMetadata } from '@nestjs/common';

/**
 * The unique key used to store and retrieve permission metadata.
 * It acts as a 'label' for the data stored by the Reflector.
 */
export const PERMISSIONS_KEY = 'permissions';

/**
 * Custom decorator to attach required permissions to a route handler.
 * * NOTE: This decorator itself does not perform any logic. It simply 
 * "tags" the method with metadata during the application's bootstrap phase.
 * The PermissionsGuard later reads this metadata to perform authorization.
 * * @param permissions - A list of required permission strings.
 * * @example
 * // Basic usage in a controller:
 * @Get()
 * @Permissions('user_read', 'user_create')
 * findAll() { ... }
 * * // Using a typed constant (Recommended):
 * @Post()
 * @Permissions(PERMISSIONS.PRODUCT_DELETE)
 * remove() { ... }
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);