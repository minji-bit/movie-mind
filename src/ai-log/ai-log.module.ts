import { Module } from '@nestjs/common';
import { AiLogService } from './ai-log.service';
import { AiLogController } from './ai-log.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AiLogController],
  providers: [AiLogService],
})
export class AiLogModule {}
