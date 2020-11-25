import { Test, TestingModule } from '@nestjs/testing';
import { EmailsResolver } from './emails.resolver';
import { EmailsService } from './emails.service';

const mockData = {
  email: 'any@email.com',
  name: 'any',
};

describe('EmailsResolver', () => {
  let resolver;
  let service;

  const serviceFactory = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailsResolver,
        {
          provide: EmailsService,
          useFactory: () => serviceFactory,
        },
      ],
    }).compile();

    resolver = module.get<EmailsResolver>(EmailsResolver);
    service = module.get<EmailsService>(EmailsService);
  });

  describe('findAll()', () => {
    it('should be called service.findAll', async () => {
      await resolver.findAll();
      expect(service.findAll).toBeCalled();
    });

    it('should be returns service.findAll return', async () => {
      (service.findAll as jest.Mock).mockReturnValue([mockData]);
      expect(await resolver.findAll()).toEqual([mockData]);
    });
  });

  describe('findOne()', () => {
    it('should be called service.findOne with correct email', async () => {
      await resolver.findOne('any@email.com');
      expect(service.findOne).toBeCalledWith('any@email.com');
    });

    it('should be returns service.findOne return', async () => {
      (service.findOne as jest.Mock).mockReturnValue(mockData);
      expect(await resolver.findOne('any@email.com')).toEqual(mockData);
    });
  });

  describe('createEmail()', () => {
    it('should be called service.create with correct params', async () => {
      await resolver.createEmail(mockData);
      expect(service.create).toBeCalledWith(mockData);
    });

    it('should be returns service.create return', async () => {
      (service.create as jest.Mock).mockReturnValue(mockData);
      expect(await resolver.createEmail(mockData)).toEqual(mockData);
    });
  });

  describe('updateEmail()', () => {
    it('should be called service.update with correct params', async () => {
      await resolver.updateEmail(mockData);
      expect(service.update).toBeCalledWith(mockData);
    });

    it('should be returns service.create return', async () => {
      (service.update as jest.Mock).mockReturnValue(mockData);
      expect(await resolver.updateEmail(mockData)).toEqual(mockData);
    });
  });

  describe('removeEmail()', () => {
    it('should be called service.removeEmail with correct email', async () => {
      await resolver.removeEmail('any@email.com');
      expect(service.remove).toBeCalledWith('any@email.com');
    });

    it('should be returns service.remove return', async () => {
      (service.remove as jest.Mock).mockReturnValue(mockData);
      expect(await resolver.removeEmail('any@email.com')).toEqual(mockData);
    });
  });
});
