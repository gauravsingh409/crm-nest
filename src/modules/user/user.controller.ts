import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
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

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.USER_READ)
  @Get('/')
  async findAll(@Query() pagination: FilterDto) {
    const { records, meta } = await this.userService.findAll(pagination);
    return ResponseService.pagination(records, meta);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.USER_READ)
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return ResponseService.success(user, 'User details retrived', 200);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.USER_CREATE)
  @Post('/')
  @HttpCode(201)
  @UseInterceptors(
    FileUploadInterceptor({
      destination: './uploads/profiles',
      fileNamePrefix: 'profile',
      maxSize: 2 * 1024 * 1024, // 2MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    }),
  )
  async create(
    @Body() body: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {

    const profileImagePath = file
      ? `/uploads/profiles/${file.filename}`
      : undefined;

    const savedUser = await this.userService.createUser(body, profileImagePath);


    return ResponseService.success(savedUser, 'User created successfully', 201);
  }


  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.USER_UPDATE)
  @Patch('/:id')
  @HttpCode(200)
  @UseInterceptors(
    FileUploadInterceptor({
      destination: './uploads/profiles',
      fileNamePrefix: 'profile',
      maxSize: 2 * 1024 * 1024, // 2MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const profileImagePath = file
      ? `/uploads/profiles/${file.filename}`
      : undefined;
    const updateUser = await this.userService.updateUser(
      id,
      body,
      profileImagePath,
    );
    return ResponseService.success(
      updateUser,
      'User updated successfully',
      201,
    );
  }


  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.USER_DELETE)
  @Delete('/:id')
  async remove(@Param('id') id: string) {
    const deleteUser = await this.userService.remove(id);
    return ResponseService.success(
      deleteUser,
      'User deleted successfully',
      200,
    );
  }
}
