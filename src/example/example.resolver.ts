import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class ExampleResolver {
  @Query((returns) => Boolean)
  isPizza(): boolean {
    return true;
  }
}
