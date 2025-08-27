import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('SGHSS - Sistema de Gestão Hospitalar')
    .setDescription(
      `
      Sistema completo de gestão hospitalar que permite:
      - Cadastro e gerenciamento de pacientes
      - Autenticação e autorização de usuários
      - Agendamento e controle de consultas
      - Gestão de profissionais de saúde
      
      ## Autenticação
      A API utiliza JWT (JSON Web Tokens) para autenticação.
      Para acessar endpoints protegidos:
      1. Faça login em /auth/login
      2. Use o token retornado no header Authorization: Bearer {token}
      
      ## Roles de Usuário
      - **PACIENTE**: Pode agendar consultas e ver seus próprios dados
      - **PROFISSIONAL**: Pode gerenciar consultas e ver dados dos pacientes
      - **ADMIN**: Acesso completo ao sistema
    `,
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Digite o JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Endpoints de autenticação e autorização')
    .addTag('users', 'Gerenciamento de usuários do sistema')
    .addTag('pacientes', 'Cadastro e gerenciamento de pacientes')
    .addTag('consultas', 'Agendamento e controle de consultas')
    .addServer('http://localhost:3000', 'Ambiente de Desenvolvimento')
    .addServer('https://api.sghss.com', 'Ambiente de Produção')
    .setContact(
      'Equipe de Desenvolvimento SGHSS',
      'https://sghss.com',
      'dev@sghss.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'SGHSS API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .topbar-wrapper .link { 
        content: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAABuklEQVR42mL8//8/AyEAqrkmNTefy+nOlL8///Pn19/fGJjYGNgEuQV4ZPllOOV55Dk52TlQ1YMBqLna3I5PFn/c+3n7970ftz+yMDAx8EpzS2sq6ogJcAuwtbS2EKyBqrkm9uOrL49//3u/7/PGt+9//P8Pxi3KJcUlxCXAGdDeQrAGGNjw8sOjP3++bXz35fuLbz8+//n994cctzSPCJcgZ0hxZQvBGmDgxdtnP///+bP2++9Xr3/8+P7v3z9xTjEeEQ4B9s7m1hZCNcDAq3dPfv759mPdr39fX//++wMftwCHEJsAW1dLawupL/z//x8DAAAAAwAIAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAE='); 
        width:120px; height:30px; 
      }
      .swagger-ui .info { margin: 50px 0; }
      .swagger-ui .info .title { color: #3b82f6; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  const appUrl = await app.getUrl();
  console.log(`Application is running on: ${appUrl}`);
  console.log(`Swagger documentation: ${appUrl}/api-docs`);
}
bootstrap();
