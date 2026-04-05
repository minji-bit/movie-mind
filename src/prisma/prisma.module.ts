import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() //Global 로 만들면 어디서든 PrismaService 를 사용할 수 있습니다.
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
