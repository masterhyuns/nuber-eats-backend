import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Example } from './entities/example.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExampleService {
  constructor(
    @InjectRepository(Example) private readonly repository: Repository<Example>,
  ) {}

  async getAllExample(): Promise<Example[]> {
    return this.repository.find();
  }
}
