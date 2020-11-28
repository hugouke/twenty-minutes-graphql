import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailsService } from './emails.service';
import { Email } from './entities/email.entity';

const mockData = {
  email: 'any@email.com',
  name: 'any',
};

describe('EmailsResolver', () => {
  let service;
  let repository;

  const repositoryFactory = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    findOneAndDelete: jest.fn(),
  };

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
    it('should be called repository.find', async () => {
      await service.findOne(mockData.email);
      expect(repository.findOne).toBeCalledWith({ email: mockData.email });
    });

    it('should be returns repository.find return', async () => {
      (repository.findOne as jest.Mock).mockReturnValue(mockData);
      expect(await service.findOne('any@email.com')).toEqual(mockData);
    });
  });

  describe('create()', () => {
    it('should be called repository.save', async () => {
      await service.create(mockData);
      expect(repository.save).toBeCalledWith(mockData);
    });

    it('should be returns repository.save return', async () => {
      (repository.save as jest.Mock).mockReturnValue(mockData);
      expect(await service.create(mockData)).toEqual(mockData);
    });

    it('should be throws if called with invalid email', async () => {
      let error;
      try {
        await service.create({ ...mockData, email: 'invalid' });
      } catch (err) {
        error = err;
      }
      expect(error[0].property).toBe('email');
    });

    it('should be throws if called with empty params', async () => {
      let error;
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

  describe('update()', () => {
    it('should be called repository.findOne', async () => {
      await service.update(mockData);
      expect(repository.findOne).toBeCalledWith({ email: mockData.email });
    });

    it('should be throw if email not exists', () => {
      (repository.findOne as jest.Mock).mockReturnValue(undefined);
      expect(service.update(mockData)).rejects.toThrow(new NotFoundException());
    });

    it('should be throws if called with empty params', async () => {
      (repository.findOne as jest.Mock).mockReturnValue(mockData);
      let error;
      try {
        await service.update({ ...mockData, name: '' });
      } catch (err) {
        error = err;
      }
      expect(error[0].property).toBe('name');
    });

    it('should be returns repository.save return', async () => {
      const mockUpdatedData = { ...mockData, name: 'updated data' };
      (repository.findOne as jest.Mock).mockReturnValue(mockData);
      (repository.save as jest.Mock).mockReturnValue(mockUpdatedData);
      expect(await service.update(mockUpdatedData)).toEqual(mockUpdatedData);
      expect(repository.save).toBeCalledWith(mockUpdatedData);
    });
  });

  describe('remove()', () => {
    it('should be called repository.findOneAndDelete', async () => {
      (repository.findOneAndDelete as jest.Mock).mockReturnValue({
        value: mockData,
      });
      await service.remove(mockData.email);
      expect(repository.findOneAndDelete).toBeCalledWith({
        email: mockData.email,
      });
    });

    it('should be throw if email not exists', () => {
      (repository.findOneAndDelete as jest.Mock).mockReturnValue({});
      expect(service.remove(mockData)).rejects.toThrow(new NotFoundException());
    });

    it('should be returns removed object', async () => {
      (repository.findOneAndDelete as jest.Mock).mockReturnValue({
        value: mockData,
      });
      expect(await service.remove(mockData.email)).toEqual(mockData);
    });
  });
});
