export const PERMISSIONS = {
/**
 * ===========================================
 *              Lead Permission
 * ===========================================
 */

  LEAD_CREATE: 'lead:create',
  LEAD_READ: 'lead:read',
  LEAD_UPDATE: 'lead:update',
  LEAD_DELETE: 'lead:delete',

  /**
 * ===========================================
 *              User Permission
 * ===========================================
 */
  USER_READ: 'user:read',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  /**
 * ===========================================
 *              Permission Permission
 * ===========================================
 */
PERMISSION_READ: 'permission:read'
} as const;
export type PermissionKey = keyof typeof PERMISSIONS;
export type PermissionValue = (typeof PERMISSIONS)[PermissionKey];
export const ALL_PERMISSIONS: PermissionValue[] = Object.values(PERMISSIONS);
