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
    PERMISSION_READ: 'permission:read',

    /**
     * ===========================================
     *              Role Permission
     * ===========================================
     */
    ROLE_READ: 'role:read',
    ROLE_CREATE: 'role:create',
    ROLE_UPDATE: 'role:update',
    ROLE_DELETE: 'role:delete',

    /**
     * ===========================================
     *              Branch Permission
     * ===========================================
     */
    BRANCH_READ: 'branch:read',
    BRANCH_CREATE: 'branch:create',
    BRANCH_UPDATE: 'branch:update',
    BRANCH_DELETE: 'branch:delete',
} as const;
export type PermissionKey = keyof typeof PERMISSIONS;
export type PermissionValue = (typeof PERMISSIONS)[PermissionKey];
export const ALL_PERMISSIONS: PermissionValue[] = Object.values(PERMISSIONS);
