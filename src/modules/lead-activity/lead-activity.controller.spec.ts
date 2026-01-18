import { Test, TestingModule } from '@nestjs/testing';
import { LeadActivityController } from './lead-activity.controller';
import { LeadActivityService } from './lead-activity.service';

describe('LeadActivityController', () => {
  let controller: LeadActivityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeadActivityController],
      providers: [LeadActivityService],
    }).compile();

    controller = module.get<LeadActivityController>(LeadActivityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
