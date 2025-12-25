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
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseService } from 'src/common/response/response.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileUploadInterceptor } from 'src/interceptor/file-upload.interceptor';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private responseService: ResponseService,
  ) {}

  @Get('/')
  async getAllUser(@Query() pagination: PaginationDto) {
    const { records, meta } = await this.userService.getAllUser(pagination);
    return this.responseService.pagination(records, meta);
  }

  @Get('/:id')
  async getUserDetails(@Param('id') id: string) {
    const user = await this.userService.getUserDetails(id);
    return this.responseService.success(user, 'User details retrived', 200);
  }

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
  async createUser(
    @Body() body: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const profileImagePath = file
      ? `/uploads/profiles/${file.filename}`
      : undefined;

    const savedUser = await this.userService.createUser(body, profileImagePath);

    return this.responseService.success(
      savedUser,
      'User created successfully',
      201,
    );
  }

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
  async updateUser(
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
    return this.responseService.success(
      updateUser,
      'User updated successfully',
      201,
    );
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    const deleteUser = await this.userService.deleteUser(id);
    return this.responseService.success(
      deleteUser,
      'User deleted successfully',
      200,
    );
  }
}
