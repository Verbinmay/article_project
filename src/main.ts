import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { APP_SETTINGS } from './app/settings/app-settings';
import { createApp } from './app/utils/app-creator.util';
import { validateEnvironmentVariables } from './app/utils/validate-environment-variables';

async function bootstrap() {
  validateEnvironmentVariables();
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  const fullApp = createApp(app);

  await fullApp.listen(process.env[APP_SETTINGS.ARTICLE_PORT]!);
}
bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
});
