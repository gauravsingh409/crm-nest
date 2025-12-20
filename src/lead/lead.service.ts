import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaginationDto } from 'src/common/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ResponseService } from 'src/common/response/response.service';

@Injectable()
export class LeadService {
  constructor(
    private prismaService: PrismaService,
    private responseService: ResponseService,
  ) {}

  async leadDetails(id: string) {}

  async getAllLead(pagination: PaginationDto) {
    const { limit, page } = pagination;
    const skip = (page - 1) * limit;
    const [lead, total] = await Promise.all([
      this.prismaService.lead.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
      }),
      this.prismaService.lead.count(),
    ]);
    return {
      records: lead,
      meta: this.responseService.paginationMetaData(total, page, limit),
    };
  }

  async createLead(request: CreateLeadDto) {
    try {
      const lead = await this.prismaService.lead.create({
        data: {
          firstName: request.firstName,
          lastName: request.lastName,
          email: request.email,
          phone: request.phone,
          whatsapp: request.whatsapp,
          address: request.address,
          dob: request.dob ? new Date(request.dob) : undefined,
          categories: request.categories,
          service: request.service,
          source: request.source,
          description: request.description,
        },
      });

      return lead;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create lead');
    }
  }

  async updateLead(id: string) {}

  async deleteLead(id: string) {}
}
