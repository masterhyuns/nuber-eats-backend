import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Example } from './entities/example.entity';
import { CreateExampleDto } from './dtos/create-example.dto';
import { ExampleService } from './example.service';

@Resolver()
export class ExampleResolver {
  constructor(private readonly exampleService: ExampleService) {}

  @Query((returns) => Boolean) // Boolean for graphql
  isPizza(): boolean {
    // boolean for typescript
    return true;
  }

  /**
   * @Args() => 필요한 것은 요청 해야 하는데 그 요청을 받아주는 것
   * @Args('veganOnly') veganOnly: boolean  괄호안은 파라미터명, 뒤에는 function을 위한 agruments 명
   * @param veganOnly
   */
  @Query((returns) => [Example]) // Boolean for graphql
  getExamples(@Args('veganOnly') veganOnly: boolean): Example[] {
    // Example for typescript
    console.log(veganOnly);
    return [];
  }

  /*@Mutation((returns) => Boolean)
  createExample(@Args() createExampleInput: CreateExampleDto): boolean {
    console.log(createExampleInput);
    return true;
  }*/

  @Query((returns) => [Example]) // Boolean for graphql
  getAllExamples(): Promise<Example[]> {
    return this.exampleService.getAllExample();
  }

  @Mutation((returns) => Boolean)
  async createExample(
    @Args() createExampleDto: CreateExampleDto,
  ): Promise<boolean> {
    try {
      await this.exampleService.createExample(createExampleDto);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
