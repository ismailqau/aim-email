/**
 * AI Email Marketing System
 * Copyright (c) 2024 Muhammad Ismail
 * Email: quaid@live.com
 * Founder: AimNovo.com | AimNexus.ai
 * 
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 * 
 * For commercial use, please maintain proper attribution.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DatabaseService } from '../common/database/database.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

// Mock the database service
jest.mock('../common/database/database.service');

// Mock the external functions
jest.mock('@email-system/db', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashedPassword'),
  verifyPassword: jest.fn().mockResolvedValue(true),
}));

import { hashPassword, verifyPassword } from '@email-system/db';

describe('AuthService', () => {
  let service: AuthService;
  let databaseService: DatabaseService;
  let jwtService: JwtService;

  const mockDatabaseService = {
    client: {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    jwtService = module.get<JwtService>(JwtService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedPassword',
      createdAt: new Date(),
    };

    it('should successfully register a new user', async () => {
      mockDatabaseService.client.user.findUnique.mockResolvedValue(null);
      mockDatabaseService.client.user.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.register(registerDto);

      expect(hashPassword).toHaveBeenCalledWith(registerDto.password);
      expect(mockDatabaseService.client.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(mockDatabaseService.client.user.create).toHaveBeenCalledWith({
        data: {
          name: registerDto.name,
          email: registerDto.email,
          password: 'hashedPassword',
        },
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          createdAt: mockUser.createdAt,
        },
        token: 'jwt-token',
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      mockDatabaseService.client.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        new ConflictException('User with this email already exists'),
      );

      expect(mockDatabaseService.client.user.create).not.toHaveBeenCalled();
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'john@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedPassword',
      createdAt: new Date(),
    };

    it('should successfully login with valid credentials', async () => {
      mockDatabaseService.client.user.findUnique.mockResolvedValue(mockUser);
      (verifyPassword as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginDto);

      expect(mockDatabaseService.client.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(verifyPassword).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          createdAt: mockUser.createdAt,
        },
        token: 'jwt-token',
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockDatabaseService.client.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );

      expect(verifyPassword).not.toHaveBeenCalled();
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockDatabaseService.client.user.findUnique.mockResolvedValue(mockUser);
      (verifyPassword as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );

      expect(verifyPassword).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    const userId = 'user-1';
    const mockUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date(),
    };

    it('should return user if found', async () => {
      mockDatabaseService.client.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser(userId);

      expect(mockDatabaseService.client.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockDatabaseService.client.user.findUnique.mockResolvedValue(null);

      await expect(service.validateUser(userId)).rejects.toThrow(
        new UnauthorizedException('User not found'),
      );
    });
  });

  describe('verifyToken', () => {
    it('should return payload for valid token', async () => {
      const mockPayload = { sub: 'user-1', email: 'john@example.com' };
      mockJwtService.verify.mockReturnValue(mockPayload);

      const result = await service.verifyToken('valid-token');

      expect(mockJwtService.verify).toHaveBeenCalledWith('valid-token');
      expect(result).toEqual(mockPayload);
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.verifyToken('invalid-token')).rejects.toThrow(
        new UnauthorizedException('Invalid token'),
      );
    });
  });
});