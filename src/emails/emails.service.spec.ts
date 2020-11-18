import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailsService } from './emails.service';
import { Email } from './entities/email.entity';

const mockData = { name: 'any', email: 'any@email.com' };

describe('EmailsService', () => {
  let service: EmailsService;
  let repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailsService,
        {
          provide: getRepositoryToken(Email),
          useFactory: () => ({ save: jest.fn(), find: jest.fn() }),
        },
      ],
    }).compile();

    service = module.get<EmailsService>(EmailsService);
    repository = module.get(getRepositoryToken(Email));
  });

  describe('create()', () => {
    it('should be called repository.save with correct params', async () => {
      await service.create(mockData);
      expect(repository.save).toBeCalledWith(mockData);
    });

    it('should be returns created object', async () => {
      (repository.save as jest.Mock).mockReturnValue(mockData);
      expect(await service.create(mockData)).toEqual(mockData);
    });

    it('should be throw if called with invalid email', async () => {
      let error = false;
      try {
        await service.create({ ...mockData, email: 'invalid' });
      } catch (err) {
        error = err;
      }
      expect(error[0].property).toBe('email');
    });

    it('should be throw if called with empty params', async () => {
      let error = false;
      try {
        await service.create({ ...mockData, name: '' });
      } catch (err) {
        error = err;
      }
      expect(error[0].property).toBe('name');

      try {
        await service.create({ ...mockData, email: '' });
      } catch (err) {
        error = err;
      }
      expect(error[0].property).toBe('email');
    });
  });

  describe('findAll()', () => {
    it('should be called repository.find', async () => {
      await service.findAll();
      expect(repository.find).toBeCalled();
    });

    it('should be returns repository.find return', async () => {
      (repository.find as jest.Mock).mockReturnValue([mockData]);
      expect(await service.findAll()).toEqual([mockData]);
    });
  });

  describe('findOne()', () => {
    it('should be called repository.findOne', async () => {
      await service.findOne(mockData.email);
      expect(repository.findOne).toBeCalled();
    });

    it('should be returns repository.find return', async () => {
      (repository.find as jest.Mock).mockReturnValue([mockData]);
      expect(await service.findAll()).toEqual([mockData]);
    });
  });
});
