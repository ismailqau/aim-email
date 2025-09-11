import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  async findAll() {
    return this.database.client.user.findMany();
  }

  async findOne(id: string) {
    return this.database.client.user.findUnique({ where: { id } });
  }
}