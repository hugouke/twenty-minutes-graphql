import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailsService } from './emails.service';
import { Email } from './entities/email.entity';

const mockData = { name: 'any', email: 'any@email.com' };

describe('EmailsService', () => {
  let service: EmailsService;
  let repository;

  const repositoryFactory = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndDelete: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailsService,
        {
          provide: getRepositoryToken(Email),
          useFactory: () => repositoryFactory,
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
    it('should be called repository.findOne with correct email', async () => {
      await service.findOne(mockData.email);
      expect(repository.findOne).toBeCalledWith({ email: mockData.email });
    });

    it('should be returns repository.findOne return', async () => {
      (repository.findOne as jest.Mock).mockReturnValue(mockData);
      expect(await service.findOne(mockData.email)).toEqual(mockData);
    });
  });

  describe('update()', () => {
    it('should be called repository.findOne with correct email', async () => {
      (repository.findOne as jest.Mock).mockReturnValue(mockData);
      await service.update(mockData);
      expect(repository.findOne).toBeCalledWith({ email: mockData.email });
    });

    it('should be throw if email not exists', async () => {
      (repository.findOne as jest.Mock).mockReturnValue(undefined);
      expect(service.update(mockData)).rejects.toThrow(new NotFoundException());
    });

    it('should be throw if called with empty name', async () => {
      let error = false;
      try {
        await service.create({ ...mockData, name: '' });
      } catch (err) {
        error = err;
      }
      expect(error[0].property).toBe('name');
    });

    it('should be called repository.save and returns updated object', async () => {
      const mockUpdatedData = { ...mockData, name: 'updated name' };
      (repository.findOne as jest.Mock).mockReturnValue(mockData);
      (repository.save as jest.Mock).mockReturnValue(mockUpdatedData);
      expect(await service.update(mockUpdatedData)).toEqual(mockUpdatedData);
      expect(repository.save).toBeCalledWith(mockUpdatedData);
    });
  });

  describe('remove()', () => {
    it('should be called repository.findOneAndDelete with correct email', async () => {
      (repository.findOneAndDelete as jest.Mock).mockReturnValue({
        value: mockData,
      });
      await service.remove(mockData.email);
      expect(repository.findOneAndDelete).toBeCalledWith({ email: mockData.email });
    });

    it('should be throw if email not exists', async () => {
      (repository.findOneAndDelete as jest.Mock).mockReturnValue({});
      expect(service.remove(mockData.email)).rejects.toThrow(new NotFoundException());
    });

    it('should be returns removed object', async () => {
      (repository.findOneAndDelete as jest.Mock).mockReturnValue({
        value: mockData,
      });
      expect(await service.remove(mockData.email)).toEqual(mockData);
    });
  });
});
