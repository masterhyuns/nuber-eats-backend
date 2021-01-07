import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ExampleModule } from './example/example.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ExampleModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'hyuns',
      password: '1234',
      database: 'nuber_eats',
      synchronize: true,
      logging: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
