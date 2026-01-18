import { Test, TestingModule } from '@nestjs/testing';
import { LeadActivityService } from './lead-activity.service';

describe('LeadActivityService', () => {
  let service: LeadActivityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeadActivityService],
    }).compile();

    service = module.get<LeadActivityService>(LeadActivityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
