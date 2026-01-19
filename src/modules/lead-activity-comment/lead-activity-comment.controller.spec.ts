import { Test, TestingModule } from '@nestjs/testing';
import { LeadActivityCommentController } from './lead-activity-comment.controller';
import { LeadActivityCommentService } from './lead-activity-comment.service';

describe('LeadActivityCommentController', () => {
  let controller: LeadActivityCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeadActivityCommentController],
      providers: [LeadActivityCommentService],
    }).compile();

    controller = module.get<LeadActivityCommentController>(LeadActivityCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
