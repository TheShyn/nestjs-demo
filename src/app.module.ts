import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModuleModule } from './config-module/config-module.module';
import { TasksModule } from './tasks/tasks.module';
import { CheckApiToken } from './common/middleware/api-token-check.middleware';
import { TasksController } from './tasks/tasks.controller';

@Module({
  imports: [TasksModule, ConfigModuleModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'TheShyn03',
      database: 'task-management',
      autoLoadEntities: true,
      entities: [],
      synchronize: true,
    }),
    AuthModule,
    ConfigModule.forRoot(),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckApiToken)
      .exclude(
        { path: "tasks", method: RequestMethod.PATCH },
        { path: "tasks", method: RequestMethod.POST },
      )
      .forRoutes(TasksController)
  }
}
