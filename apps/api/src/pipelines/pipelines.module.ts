import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PipelinesController } from './pipelines.controller';
import { PipelinesService } from './pipelines.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email-pipeline',
    }),
  ],
  controllers: [PipelinesController],
  providers: [PipelinesService],
  exports: [PipelinesService],
})
export class PipelinesModule {}