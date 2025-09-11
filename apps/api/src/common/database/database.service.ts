import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma } from '@email-system/db';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await prisma.$connect();
    console.log('🗄️  Database connected successfully');
  }

  async onModuleDestroy() {
    await prisma.$disconnect();
    console.log('🗄️  Database disconnected');
  }

  get client() {
    return prisma;
  }
}