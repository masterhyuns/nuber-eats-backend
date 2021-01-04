import { Query, Resolver } from '@nestjs/graphql';
import { Example } from './entities/example.entity';

@Resolver()
export class ExampleResolver {
  @Query((returns) => Boolean) // Boolean for graphql
  isPizza(): boolean {
    // boolean for typescript
    return true;
  }

  @Query((returns) => Example) // Boolean for graphql
  getExample() {
    // Example for typescript
    return true;
  }
}
