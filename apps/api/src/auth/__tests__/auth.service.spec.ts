import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { DatabaseService } from '../../common/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let mockDatabase: jest.Mocked<DatabaseService>;
  let mockJwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    mockDatabase = {
      client: {
        user: {
          findUnique: jest.fn(),
          create: jest.fn(),
        },
      },
    } as any;

    mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: DatabaseService, useValue: mockDatabase },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      mockDatabase.client.user.findUnique.mockResolvedValue(null);
      mockDatabase.client.user.create.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
      } as any);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.register(userData);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(userData.email);
    });

    it('should throw ConflictException if user exists', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      mockDatabase.client.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'john@example.com',
      } as any);

      await expect(service.register(userData)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return user and token for valid credentials', async () => {
      const credentials = {
        email: 'john@example.com',
        password: 'password123',
      };

      mockDatabase.client.user.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        createdAt: new Date(),
      } as any);
      mockJwtService.sign.mockReturnValue('jwt-token');

      // Mock password verification (this would normally be done by bcrypt)
      jest.mock('@email-system/db', () => ({
        verifyPassword: jest.fn().mockResolvedValue(true),
      }));

      const result = await service.login(credentials);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      const credentials = {
        email: 'invalid@example.com',
        password: 'password123',
      };

      mockDatabase.client.user.findUnique.mockResolvedValue(null);

      await expect(service.login(credentials)).rejects.toThrow(UnauthorizedException);
    });
  });
});