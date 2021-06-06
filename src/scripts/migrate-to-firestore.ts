import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { TransactionsModule } from "src/transactions/transactions.module";
import { TransactionsService } from "src/transactions/transactions.service";

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  const transactionsService = app.select(TransactionsModule).get(TransactionsService);
  await transactionsService.migrateToFirestore();

  await app.close()
}

console.info('✨✨✨DEV▶️STARTED✨✨✨DEV');
bootstrap()
  .then(() => console.info('✨✨✨DONE✨✨✨'))
  .catch((error) => {
    console.info('🚨🚨🚨ERROR🚨🚨🚨');
    console.error(error);
  });

