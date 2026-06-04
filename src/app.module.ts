import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ReviewModule } from './review/review.module';
import { AiModule } from './ai/ai.module';
import { AnalysisModule } from './analysis/analysis.module';
import { ConfigModule } from '@nestjs/config';
import { PromptVersionController } from './prompt-version/prompt-version.controller';
import { PromptVersionService } from './prompt-version/prompt-version.service';
import { PromptVersionModule } from './prompt-version/prompt-version.module';
import { AiLogController } from './ai-log/ai-log.controller';
import { AiLogService } from './ai-log/ai-log.service';
import { AiLogModule } from './ai-log/ai-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ReviewModule,
    AiModule,
    AnalysisModule,
    PromptVersionModule,
    AiLogModule,
  ],
  controllers: [AppController, PromptVersionController, AiLogController],
  providers: [AppService, PromptVersionService, AiLogService],
})
export class AppModule {}
