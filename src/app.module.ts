import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { BootstrapModule } from './bootstrap/bootstrap.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { LeadModule } from './modules/lead/lead.module';
import { BranchModule } from './modules/branch/branch.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { LeadActivityModule } from './modules/lead-activity/lead-activity.module';
import { LeadActivityCommentModule } from './modules/lead-activity-comment/lead-activity-comment.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    LeadModule,
    BranchModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BootstrapModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
      },
    }),
    DoctorModule,
    RoleModule,
    PermissionModule,
    LeadActivityModule,
    LeadActivityCommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
