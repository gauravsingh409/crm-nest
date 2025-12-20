import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeadService {
  constructor(private prismaService: PrismaService) {}

  async leadDetails(id: string) {}

  async getAllLead(pagination: PaginationDto) {}

  async createLead() {}

  async updateLead(id: string) {}

  async deleteLead(id: string) {}
}
