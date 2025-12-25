import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './delivery/modules/AppModule';

async function bootstrap() {
  // Log environment variables (without sensitive data)
  console.log('🔧 Environment check:');
  console.log(`  PORT: ${process.env.PORT || '3000 (default)'}`);
  console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`  DATABASE_URL: ${process.env.DATABASE_URL ? '✅ configured' : '❌ NOT SET'}`);
  console.log(`  JWT_SECRET: ${process.env.JWT_SECRET ? '✅ configured' : '❌ NOT SET'}`);
  console.log(`  RAILWAY_PUBLIC_DOMAIN: ${process.env.RAILWAY_PUBLIC_DOMAIN || 'not set'}`);
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ FATAL: DATABASE_URL is not set!');
    process.exit(1);
  }
  
  console.log('🚀 Creating NestJS application...');
  try {
    const app = await NestFactory.create(AppModule);
    console.log('✅ NestJS application created successfully');

    // Enable CORS - Allow all origins if FRONTEND_URL is not set (for single service deployment)
    const frontendUrl = process.env.FRONTEND_URL;
    if (frontendUrl) {
      app.enableCors({
        origin: frontendUrl,
        credentials: true,
      });
    } else {
      // Allow all origins if no frontend URL is configured
      app.enableCors({
        origin: true,
        credentials: true,
      });
    }

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.setGlobalPrefix('api/v1');
    console.log('✅ Global prefix set to /api/v1');

    // Add raw Express middleware to log ALL incoming requests BEFORE NestJS routing
    app.use((req: any, res: any, next: any) => {
      console.log(`[RAW_REQUEST] ${req.method} ${req.url} | Path: ${req.path} | OriginalUrl: ${req.originalUrl}`);
      next();
    });

    const port = process.env.PORT || 3000;
    console.log(`🚀 Starting server on port ${port}...`);
    
    await app.listen(port, '0.0.0.0'); // Listen on all interfaces for Railway
    console.log(`✅ Server listening on port ${port}`);
    
    // Use Railway domain if available, otherwise fallback to localhost
    const baseUrl = process.env.RAILWAY_PUBLIC_DOMAIN 
      ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
      : `http://localhost:${port}`;
    
    console.log(`Application is running on: ${baseUrl}/api/v1`);
  } catch (error) {
    console.error('❌ Error during application startup:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  if (error instanceof Error) {
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
  }
  process.exit(1);
});
