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

    /**
     * ===========================================
     *              Lead Activity Comment Permission
     * ===========================================
     */
    LEAD_ACTIVITY_COMMENT_READ: 'lead_activity_comment:read',
    LEAD_ACTIVITY_COMMENT_CREATE: 'lead_activity_comment:create',
    LEAD_ACTIVITY_COMMENT_UPDATE: 'lead_activity_comment:update',
    LEAD_ACTIVITY_COMMENT_DELETE: 'lead_activity_comment:delete',


    /**
     * ===========================================
     *              Follow Up Permission
     * ===========================================
     */
    FOLLOW_UP_READ: 'follow_up:read',
    FOLLOW_UP_CREATE: 'follow_up:create',
    FOLLOW_UP_UPDATE: 'follow_up:update',
    FOLLOW_UP_DELETE: 'follow_up:delete',


} as const;
export type PermissionKey = keyof typeof PERMISSIONS;
export type PermissionValue = (typeof PERMISSIONS)[PermissionKey];
export const ALL_PERMISSIONS: PermissionValue[] = Object.values(PERMISSIONS);
