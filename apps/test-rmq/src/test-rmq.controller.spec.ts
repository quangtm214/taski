import { Test, TestingModule } from '@nestjs/testing';
import { TestRmqController } from './test-rmq.controller';
import { TestRmqService } from './test-rmq.service';

describe('TestRmqController', () => {
  let testRmqController: TestRmqController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TestRmqController],
      providers: [TestRmqService],
    }).compile();

    testRmqController = app.get<TestRmqController>(TestRmqController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(testRmqController.getHello()).toBe('Hello World!');
    });
  });
});
