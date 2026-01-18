import { Injectable } from '@nestjs/common';
import { FilterDto } from 'src/common/filter.dto';
import { ResponseService } from 'src/common/response.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionService {
  constructor(private prismaService: PrismaService) { }

  async findAll(pagination: FilterDto) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    const [permission, total] = await Promise.all([
      this.prismaService.permission.findMany({
        skip,
        take: limit,
      }),
      this.prismaService.permission.count(),
    ]);

    const meta = {
      page,
      limit,
      total,
    };

    return { meta: ResponseService.paginationMetaData(total, page, limit), records: permission };
  }
}
