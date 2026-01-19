import { Test, TestingModule } from '@nestjs/testing';
import { LeadActivityCommentService } from './lead-activity-comment.service';

describe('LeadActivityCommentService', () => {
  let service: LeadActivityCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeadActivityCommentService],
    }).compile();

    service = module.get<LeadActivityCommentService>(LeadActivityCommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
