import { Resolver, Query, ObjectType, Field } from '@nestjs/graphql';
import { SeedService } from './seed.service';

@ObjectType()
class SeedData {
  @Field()
  users: number;

  @Field()
  projects: number;

  @Field()
  tasks: number;
}

@ObjectType()
class SeedResponse {
  @Field()
  message: string;

  @Field(() => SeedData)
  data: SeedData;
}

@Resolver()
export class SeedResolver {
  constructor(private readonly seedService: SeedService) {}

  @Query(() => SeedResponse, {
    name: 'seed',
    description: 'Ejecutar seed para poblar la base de datos con datos iniciales',
  })
  async runSeed(): Promise<SeedResponse> {
    return await this.seedService.runSeed();
  }
}

