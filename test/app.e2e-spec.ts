import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getConnection, Repository } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

const GRAPHQL_ENDPOINT = '/graphql';
describe('User Resolver (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  const testUser = {
    email: 'client@naver.com',
    password: '12345',
  };
  let jwtToken: string;

  const baseTest = () => request(app.getHttpServer()).post(GRAPHQL_ENDPOINT);
  const publicTest = (query: string) => baseTest().send({ query });
  const privateTest = (query: string) =>
    baseTest().set('x-jwt', jwtToken).send({ query });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await app.close();
  });

  describe('createAccount', () => {
    it('new account', async () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation{
            createAccount(input: {
              email:"${testUser.email}",
              password:"${testUser.password}",
              role: Client
            }){
              ok
              error
            }
          }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                createAccount: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });
    it('already email', async () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation{
            createAccount(input: {
              email:"${testUser.email}",
              password:"${testUser.password}",
              role: Client
            }){
              ok
              error
            }
          }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                createAccount: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
          expect(error).toBe('There is a user with that email already');
        });
    });
  });

  describe('login', () => {
    it('should login with correct credentials', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation{
            login(input: {
              email:"${testUser.email}",
              password:"${testUser.password}",
            }){
              ok
              error
              token
            }
          }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                login: { ok, error, token },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(token).toEqual(expect.any(String));
          jwtToken = token;
        });
    });

    it('wrong password', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation{
            login(input: {
              email:"${testUser.email}",
              password:"123",
            }){
              ok
              error
            }
          }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                login: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
          expect(error).toBe('Password not correct');
        });
    });
  });

  describe('user profile', () => {
    let userId: number;
    beforeAll(async () => {
      const [user] = await userRepository.find();
      userId = user.id;
    });

    it("should see a user's profile", () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('x-jwt', jwtToken)
        .send({
          query: `
        {
          userProfile(userId:${userId}){
            ok
            user {
              id
              email
            }
          }
        }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                userProfile: {
                  user: { id },
                },
              },
            },
          } = res;
          expect(id).toBe(userId);
        });
    });

    it('should not found a user', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('x-jwt', jwtToken)
        .send({
          query: `
        {
          userProfile(userId:123){
            ok
            error
            user {
              id
              email
            }
          }
        }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                userProfile: { error },
              },
            },
          } = res;
          expect(error).toEqual('User Not Found');
        });
    });
  });

  describe('me', () => {
    let userId: number;
    beforeAll(async () => {
      const [user] = await userRepository.find();
      userId = user.id;
    });
    it('find me', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('x-jwt', jwtToken)
        .send({
          query: `
          {
            me {
              id
              email
            }
          }
          `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                me: { id },
              },
            },
          } = res;
          expect(id).toEqual(userId);
        });
    });

    it('none auth', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          {
            me {
              id
              email
            }
          }
          `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: { errors },
          } = res;
          const [error] = errors;
          expect(error.message).toBe('Forbidden resource');
        });
    });
  });

  describe('editProfile', () => {
    const NEW_EMAIL = '1234@naver.com';
    it('should change email', () => {
      return privateTest(`
          mutation{
            editProfile(input:{
              email:"${NEW_EMAIL}"
            }){
              ok
              error
            }
          }
          `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                editProfile: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });
    it('shout have new email', () => {
      return privateTest(`
                  {
                    me {
                      email
                    }
                  }
                `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                me: { email },
              },
            },
          } = res;
          expect(email).toBe(NEW_EMAIL);
        });
    });
  });
});
