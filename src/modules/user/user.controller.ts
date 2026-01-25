import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseService } from 'src/common/response.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterDto } from 'src/common/filter.dto';
import { FileUploadInterceptor } from 'src/interceptor/file-upload.interceptor';
import { JwtAuthGuard } from 'src/common/gaurds/jwt-auth.gaurd';
import { PermissionsGuard } from 'src/common/gaurds/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/constant/permission';
import { UserEntity } from './entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Get all users with pagination and search
   * Requires USER_READ permission
   */
  @Get('/')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.USER_READ)
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves a paginated list of users with optional search filtering',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    example: 1,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    example: 10,
    description: 'Items per page (default: 10)',
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    example: 'John',
    description: 'Search by email, first name, last name or phone',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users fetched successfully',
    isArray: true,
    type: UserEntity,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid authentication token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async findAll(@Query() pagination: FilterDto) {
    const { records, meta } = await this.userService.findAll(pagination);
    return ResponseService.pagination(records, meta);
  }

  /**
   * Get user details by ID
   * Requires USER_READ permission
   */
  @Get('/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.USER_READ)
  @ApiOperation({
    summary: 'Get user details',
    description: 'Retrieves detailed information about a specific user including profile and roles',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID',
    example: 'user_123abc',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User details fetched successfully',
    type: UserEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid authentication token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return ResponseService.success(user, 'User details retrieved', HttpStatus.OK);
  }

  /**
   * Create a new user with optional profile image
   * Requires USER_CREATE permission
   */
  @Post('/')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.USER_CREATE)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileUploadInterceptor({
      destination: './uploads/profiles',
      fileNamePrefix: 'profile',
      maxSize: 2 * 1024 * 1024, // 2MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a new user with profile information and assigns roles',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          example: 'John',
          description: 'User first name',
        },
        lastName: {
          type: 'string',
          example: 'Doe',
          description: 'User last name',
        },
        email: {
          type: 'string',
          example: 'john@example.com',
          description: 'User email address',
        },
        phone: {
          type: 'string',
          example: '+977-9841234567',
          description: 'User phone number (Nepal format)',
        },
        password: {
          type: 'string',
          example: 'SecurePass@123',
          description: 'User password (min 6 characters)',
        },
        role: {
          type: 'array',
          items: { type: 'string' },
          example: ['role_123', 'role_456'],
          description: 'Array of role IDs',
        },
        profileImage: {
          type: 'string',
          format: 'binary',
          description: 'Profile image file (JPEG/PNG, max 2MB)',
        },
      },
      required: ['firstName', 'lastName', 'email', 'password', 'role'],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
    type: UserEntity,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or validation failed',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid authentication token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already exists',
  })
  async create(
    @Body() body: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const profileImagePath = file ? `/uploads/profiles/${file.filename}` : undefined;
    const savedUser = await this.userService.createUser(body, profileImagePath);
    return ResponseService.success(
      savedUser,
      'User created successfully',
      HttpStatus.CREATED,
    );
  }

  /**
   * Update an existing user with optional profile image
   * Requires USER_UPDATE permission
   */
  @Patch('/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.USER_UPDATE)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileUploadInterceptor({
      destination: './uploads/profiles',
      fileNamePrefix: 'profile',
      maxSize: 2 * 1024 * 1024, // 2MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update a user',
    description: 'Updates an existing user with partial or complete data',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID',
    example: 'user_123abc',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          example: 'John',
          description: 'User first name',
        },
        lastName: {
          type: 'string',
          example: 'Doe Updated',
          description: 'User last name',
        },
        email: {
          type: 'string',
          example: 'john.updated@example.com',
          description: 'User email address',
        },
        phone: {
          type: 'string',
          example: '+977-9845678901',
          description: 'User phone number (Nepal format)',
        },
        password: {
          type: 'string',
          example: 'NewSecurePass@456',
          description: 'New user password (min 6 characters)',
        },
        role: {
          type: 'array',
          items: { type: 'string' },
          example: ['role_123'],
          description: 'Array of role IDs (replaces existing roles)',
        },
        profileImage: {
          type: 'string',
          format: 'binary',
          description: 'New profile image file (JPEG/PNG, max 2MB)',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
    type: UserEntity,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or validation failed',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid authentication token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already exists',
  })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const profileImagePath = file ? `/uploads/profiles/${file.filename}` : undefined;
    const updateUser = await this.userService.updateUser(id, body, profileImagePath);
    return ResponseService.success(updateUser, 'User updated successfully', HttpStatus.OK);
  }

  /**
   * Delete a user
   * Requires USER_DELETE permission
   */
  @Delete('/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.USER_DELETE)
  @ApiOperation({
    summary: 'Delete a user',
    description: 'Deletes a specific user and associated profile permanently',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID',
    example: 'user_123abc',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User deleted successfully',
    type: UserEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid authentication token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async remove(@Param('id') id: string) {
    const deleteUser = await this.userService.remove(id);
    return ResponseService.success(deleteUser, 'User deleted successfully', HttpStatus.OK);
  }
}
