import { ApiProperty } from '@nestjs/swagger';

export class UserProfileEntity {
  @ApiProperty({
    example: 'profile_123',
    description: 'User profile ID',
  })
  id: string;

  @ApiProperty({
    example: 'John',
    description: 'First name',
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name',
  })
  lastName: string;

  @ApiProperty({
    example: '+977-9841234567',
    description: 'Phone number',
    nullable: true,
  })
  phone?: string;

  @ApiProperty({
    example: '/uploads/profiles/profile_123.jpg',
    description: 'Profile image path',
    nullable: true,
  })
  profile?: string;

  @ApiProperty({
    example: 'user_123',
    description: 'Associated user ID',
  })
  userId: string;

  @ApiProperty({
    example: '2026-01-15T10:30:00Z',
    description: 'Profile creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-01-20T14:45:00Z',
    description: 'Last update date',
  })
  updatedAt: Date;
}

export class RoleEntity {
  @ApiProperty({
    example: 'role_123',
    description: 'Role ID',
  })
  id: string;

  @ApiProperty({
    example: 'ADMIN',
    description: 'Role name',
  })
  name: string;
}

export class UserRoleEntity {
  @ApiProperty({
    example: 'role_123',
    description: 'Role ID',
  })
  id: string;

  @ApiProperty({
    example: 'ADMIN',
    description: 'Role name',
  })
  name: string;
}

export class UserEntity {
  @ApiProperty({
    example: 'user_123',
    description: 'User ID',
  })
  id: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address (unique)',
  })
  email: string;

  @ApiProperty({
    example: true,
    description: 'User active status',
  })
  isActive: boolean;

  @ApiProperty({
    example: '2026-01-15T10:30:00Z',
    description: 'User creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-01-20T14:45:00Z',
    description: 'User last update date',
  })
  updatedAt: Date;

  @ApiProperty({
    type: UserProfileEntity,
    description: 'User profile details',
    nullable: true,
  })
  profile?: UserProfileEntity;

  @ApiProperty({
    type: [UserRoleEntity],
    description: 'User assigned roles',
  })
  roles: UserRoleEntity[];
}
