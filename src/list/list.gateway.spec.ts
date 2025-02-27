import { Test, TestingModule } from '@nestjs/testing';
import { ListGateway } from './list.gateway';
import { ListService } from './list.service';

describe('ListGateway', () => {
  let gateway: ListGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListGateway, ListService],
    }).compile();

    gateway = module.get<ListGateway>(ListGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
