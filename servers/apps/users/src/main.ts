import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(UsersModule);
  //configuring the application to serve static assets
  //RQ: .. means  move one level up in the directory hierarchy
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'servers/email-templates'));

  app.setViewEngine('ejs'); //specify the template engine that will be used to render views

  await app.listen(4001);
}
bootstrap();
