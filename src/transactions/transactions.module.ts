import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [TransactionsService, PrismaService],
})
export class TransactionsModule {}
