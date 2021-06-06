import { HttpService, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.service';
import dayjs from 'src/utils/helpers/dayjs';
import CryptoJS from 'crypto-js';
import { SYMBOL } from '.prisma/client';
import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly firestore: FirebaseFirestoreService,
  ) { }

  private readonly logger = new Logger(TransactionsService.name);

  @Cron(CronExpression.EVERY_8_HOURS)
  async fetchFundingRate() {
    this.logger.debug(`start at ${dayjs().format()}`);
    const result = await this.fetchFundingFee();
    const execDate = dayjs.unix(result.exec_timestamp).utc();
    const fundingRateAt = execDate.clone().subtract(8, 'hour').toDate();

    await this.firestore.collection('transactions').add({
      fundingRate: result.funding_rate,
      fundingRateAt,
      symble: 'ethusd',
      side: result.side,
      size: result.size,
      execFee: result.exec_fee,
      execAt: execDate.toDate(),
    })

    await this.prisma.transactions.create({
      data: {
        fundingRate: result.funding_rate,
        fundingRateAt,
        symble: 'ethusd',
        side: result.side,
        size: result.size,
        execFee: result.exec_fee,
        execAt: execDate.toDate(),
      },
    });
  }

  private getSignature(params: any, secret: string): string {
    let orderedParams = '';
    Object.keys(params)
      .sort()
      .forEach(function (key) {
        orderedParams += key + '=' + params[key] + '&';
      });
    orderedParams = orderedParams.substring(0, orderedParams.length - 1);

    return CryptoJS.HmacSHA256(orderedParams, secret).toString();
  }

  private async fetchFundingFee(): Promise<{
    symbol: SYMBOL;
    side: string;
    size: number;
    funding_rate: number;
    exec_fee: number;
    exec_timestamp: number;
  }> {
    const apiKey = this.config.get<string>('API_SERCRET_KEY');
    const sercret = this.config.get<string>('SERCRET_KEY');
    const baseUrl = this.config.get<string>('BASE_URL');

    const params = {
      api_key: apiKey,
      symbol: 'ETHUSD',
      timestamp: Date.now(),
    };
    const sign = this.getSignature(params, sercret);

    const res = await this.http
      .get(`${baseUrl}private/funding/prev-funding`, {
        params: {
          ...params,
          sign,
        },
      })
      .toPromise();
    return res.data.result;
  }

  async migrateToFirestore(): Promise<void> {
    const allTransactions = await this.prisma.transactions.findMany();

    console.log('data count', allTransactions.length);

    for (const transaction of allTransactions) {
      await this.firestore.collection('transactions').add({
        fundingRate: transaction.fundingRate,
        fundingRateAt: transaction.fundingRateAt,
        symble: transaction.symble,
        side: transaction.side,
        size: transaction.size,
        execFee: transaction.execFee,
        execAt: transaction.execAt,
      })
    }
  }
}
