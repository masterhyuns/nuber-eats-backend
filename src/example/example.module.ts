import { Module } from '@nestjs/common';
import { ExampleResolver } from './example.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Example } from './entities/example.entity';
import { ExampleService } from './example.service';

@Module({
  imports: [TypeOrmModule.forFeature([Example])],
  providers: [ExampleResolver, ExampleService],
})
export class ExampleModule {}
