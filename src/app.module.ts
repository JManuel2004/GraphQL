import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
   
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true, 
      context: ({ req }) => ({ req }), 
      formatError: (error) => {
        return {
          message: error.message,
          statusCode: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
          timestamp: new Date().toISOString(),
        };
      },
    }),

   
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        uuid: 'uuid',
        autoLoadEntities: true,
        synchronize: true, 
        logging: false,
      }),
    }),

    
    UsersModule,
    AuthModule,
    ProjectsModule,
    TasksModule,
    SeedModule,
  ],
})
export class AppModule {}