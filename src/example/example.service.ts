import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Example } from './entities/example.entity';
import { Repository } from 'typeorm';
import { CreateExampleDto } from './dtos/create-example.dto';

@Injectable()
export class ExampleService {
  constructor(
    @InjectRepository(Example) private readonly repository: Repository<Example>,
  ) {}

  async getAllExample(): Promise<Example[]> {
    return this.repository.find();
  }

  async createExample(createExampleDto: CreateExampleDto): Promise<Example> {
    const newExample = this.repository.create(createExampleDto);
    return this.repository.save(newExample);
  }
}
