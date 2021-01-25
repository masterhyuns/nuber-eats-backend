import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  //app.use(ㅓwtMiddleware); // 함수형 미들웨어만 가능
  await app.listen(4000);
}

bootstrap().then(() => {
  console.log('server started');
});
