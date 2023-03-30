import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

class MockUserRepository {
  #data = [
    { email: 'kychoi@42.fr', id: 1, name: 'kyubong' },
    { email: 'kychoi2@42.fr', id: 2, name: 'kyubong2' },
  ];

  findOne(options: any) {
    const key: string = Object.keys(options.where)[0];
    const data = this.#data.find((user) => user[key] === options.where[key]);
    return data ? data : null;
  }
}

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: MockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('has to find a user by email', () => {
      expect(service.findByEmail('kychoi@42.fr')).resolves.toStrictEqual({
        email: 'kychoi@42.fr',
        id: 1,
        name: 'kyubong',
      });
    });
    it('has to return null when no correspoding email', () => {
      expect(service.findByEmail('kychoi@422.fr')).resolves.toStrictEqual(null);
    });
  });

  describe('findByName', () => {
    it('has to find a user by email', () => {
      expect(service.findByName('kyubong')).resolves.toStrictEqual({
        email: 'kychoi@42.fr',
        id: 1,
        name: 'kyubong',
      });
    });
    it('has to return null when no correspoding name', () => {
      expect(service.findByName('kyyubong')).resolves.toStrictEqual(null);
    });
  });

  describe('findOne', () => {
    it('has to find a user by email', () => {
      expect(service.findOne(1)).resolves.toStrictEqual({
        email: 'kychoi@42.fr',
        id: 1,
        name: 'kyubong',
      });
    });
    it('has to return null when no correspoding id', () => {
      expect(service.findOne(3)).resolves.toStrictEqual(null);
    });
  });
});
