import { Test, TestingModule } from '@nestjs/testing';
import { ListItemController } from './list-item.controller';

describe('ListItemController', () => {
  let controller: ListItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListItemController],
    }).compile();

    controller = module.get<ListItemController>(ListItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
