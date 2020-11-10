import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Email } from '../src/emails/entities/email.entity';
import * as request from 'supertest';
import { MongoRepository } from 'typeorm';
import { AppModule } from '../src/app.module';

const mockData = { email: 'any@email.com', name: 'any' };

describe('EmailResolver (e2e)', () => {
  let app: INestApplication;
  let repository: MongoRepository<Email>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        { provide: getRepositoryToken(Email), useClass: MongoRepository },
      ],
    }).compile();

    app = module.createNestApplication();
    repository = module.get(getRepositoryToken(Email));
    await app.init();
    await repository.deleteMany({});
  });

  afterEach(async () => {
    await app.close();
  });

  describe('query emails', () => {
    it('should be return empty array if database empty', async () => {
      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: 'query{emails{name,email}}',
        })
        .expect(200);
      expect(result.body.data.emails).toEqual([]);
    });

    it('should be return array with emails in database', async () => {
      await repository.save({ ...mockData });
      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: 'query{emails{name,email}}',
        })
        .expect(200);
      expect(result.body.data.emails).toHaveLength(1);
      expect(result.body.data.emails[0]).toEqual(mockData);
    });
  });

  describe('query email', () => {
    it('should be return email in database', async () => {
      await repository.save({ ...mockData });
      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `query{email(email:"${mockData.email}"){name,email}}`,
        })
        .expect(200);
      expect(result.body.data.email).toEqual(mockData);
    });
  });

  describe('mutation createEmail', () => {
    it('should be return email in database', async () => {
      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation{createEmail(createEmailInput: {email:"${mockData.email}", name:"${mockData.name}"}){name,email}}`,
        })
        .expect(200);
      const data = await repository.find();

      expect(data).toHaveLength(1);
      expect({ ...data[0], _id: 'any' }).toEqual({ ...mockData, _id: 'any' });
      expect(result.body.data.createEmail).toEqual(mockData);
    });

    it('should be return 400 error if called with invalid params', async () => {
      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation{createEmail(createEmailInput: {email:"INVALID"}){name,email}}`,
        })
        .expect(400);
    });
  });

  describe('mutation updateEmail', () => {
    it('should be email is updated in database and return it', async () => {
      const mockUpdatedData = { ...mockData, name: 'updated name' };
      await repository.save({ ...mockData });
      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation{updateEmail(updateEmailInput: {email:"${mockData.email}", name:"${mockUpdatedData.name}"}){name,email}}`,
        })
        .expect(200);
      const data = await repository.find();

      expect({ ...data[0], _id: 'any' }).toEqual({
        ...mockUpdatedData,
        _id: 'any',
      });
      expect(result.body.data.updateEmail).toEqual(mockUpdatedData);
    });

    it('should be return 400 error if called with invalid params', async () => {
      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation{updateEmail(updateEmailInput: {email:"INVALID"}){name,email}}`,
        })
        .expect(400);
    });
  });

  describe('mutation removeEmail', () => {
    it('should be email is deleted in database', async () => {
      await repository.save({ ...mockData });
      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation{removeEmail(email:"${mockData.email}"){email,name}}`,
        })
        .expect(200);
      const data = await repository.find();

      expect(data).toHaveLength(0);
      expect(result.body.data.removeEmail).toEqual(mockData);
    });
  });
});
