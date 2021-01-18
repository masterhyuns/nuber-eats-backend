import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { JwtService } from '../jwt/jwt.service';
import { Repository } from 'typeorm';
import { CommonUtils } from '../common/common.utils';
import { LoginInput } from './dtos/login.dto';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOneOrFail: jest.fn(),
});
const mockJwtService = {
  sign: jest.fn(() => 'token'),
};
type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UsersService;
  let repository: MockRepository<User>;
  // beforeAll e2e test때 주로 이용
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    const createAccountArgs = {
      email: '213123',
      password: '123123',
      role: UserRole.Owner,
    };
    it('should fail if user exists', async () => {
      // repository mock data 생성
      repository.findOne.mockResolvedValue({
        id: '1',
        email: 'test@naver.com',
      });
      const result = await service.createAccount(createAccountArgs);
      expect(result).toMatchObject(
        CommonUtils.output('There is a user with that email already'),
      );
    });

    it('should create a new user', async () => {
      repository.findOne.mockResolvedValue(undefined);
      repository.create.mockReturnValue(createAccountArgs);
      const result = await service.createAccount(createAccountArgs);

      expect(repository.create).toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith(createAccountArgs);

      expect(repository.save).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(createAccountArgs);

      expect(result).toEqual(CommonUtils.output());
    });

    it('should fail on exception', async () => {
      repository.findOne.mockRejectedValue(new Error('kkk'));
      const result = await service.createAccount(createAccountArgs);

      expect(result).toEqual(CommonUtils.output("Couldn't create account"));
    });
  });

  describe('login', () => {
    const loginInput: LoginInput = {
      email: 'test@naver.com',
      password: '1234',
    };
    it('should be fail if user not found', async () => {
      repository.findOne.mockResolvedValue(undefined);
      const result = await service.login(loginInput);

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith(expect.any(Object));

      expect(result).toEqual(CommonUtils.output('User not found'));
    });
    it('should fail if the password is wrong', async () => {
      const mockUser = {
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };
      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.login(loginInput);
      expect(result).toEqual(CommonUtils.output('Password not correct'));
    });

    it('should return token if password correct', async () => {
      const mockedUser = {
        id: 3,
        checkPassword: jest.fn(() => Promise.resolve(true)),
      };
      repository.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginInput);
      expect(mockJwtService.sign).toHaveBeenCalledTimes(1);
      expect(mockJwtService.sign).toHaveBeenCalledWith(expect.any(Number));
      expect(result).toEqual({ ok: true, token: 'token' });
    });

    it('should fail on exception', async () => {
      repository.findOne.mockRejectedValue(new Error(':)'));
      const result = await service.login(loginInput);
      expect(result).toEqual(CommonUtils.output("Couldn't login"));
    });
  });
  describe('findById', () => {
    const findByIdArgs = {
      id: 1,
    };
    it('should find an existing user', async () => {
      repository.findOneOrFail.mockResolvedValue(findByIdArgs);
      const result = await service.findById(1);
      expect(result).toEqual({ ok: true, user: findByIdArgs });
    });

    it('should fail of no user is found', async () => {
      repository.findOneOrFail.mockRejectedValue(new Error());
      const result = await service.findById(1);
      expect(result).toEqual(CommonUtils.output('User Not Found'));
    });
  });
  describe('editProfile', () => {
    it('should change email', async () => {
      const oldUser = {
        email: 'bs@old.com',
      };
      const editProfileArgs = {
        userId: 1,
        input: { email: 'bs@new.com' },
      };
      repository.findOne.mockResolvedValue(oldUser);

      const result = await service.editProfile(
        editProfileArgs.userId,
        editProfileArgs.input,
      );

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        id: editProfileArgs.userId,
      });
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(editProfileArgs.input);
      expect(result).toEqual(CommonUtils.output());
    });

    it('should change password', async () => {
      const editProfileArgs = {
        userId: 1,
        input: { password: '1234' },
      };
      repository.findOne.mockResolvedValue({ password: 'old' });
      const result = await service.editProfile(
        editProfileArgs.userId,
        editProfileArgs.input,
      );

      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        id: editProfileArgs.userId,
      });

      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(editProfileArgs.input);
      expect(result).toEqual(CommonUtils.output());
    });

    it('should change role', async () => {
      const editProfileArgs = {
        userId: 1,
        input: { role: UserRole.Client },
      };
      repository.findOne.mockResolvedValue({ role: UserRole.Owner });
      const result = await service.editProfile(
        editProfileArgs.userId,
        editProfileArgs.input,
      );

      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        id: editProfileArgs.userId,
      });

      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(editProfileArgs.input);
      expect(result).toEqual(CommonUtils.output());
    });

    it('should fail on exception', async () => {
      repository.findOne.mockRejectedValue(new Error());
      const result = await service.editProfile(1, { email: '123' });
      expect(result).toEqual(CommonUtils.output("Couldn't edit profile"));
    });

    it('user not find', async () => {
      repository.findOne.mockResolvedValue(null);
      const result = await service.editProfile(1, { email: '1234' });
      expect(result).toEqual(CommonUtils.output('User not found'));
    });
  });
});
