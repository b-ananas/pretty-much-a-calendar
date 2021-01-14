import { Dog } from "../entity/Dog";
import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class DogResolver {
  @Query(() => Dog)
  @UseMiddleware(isAuth)
  async dog(@Arg("id") id: string) {
    return (await Dog.findOne(id, { relations: ["photos"] })) || {};
  }
  @Query(() => [Dog])
  @UseMiddleware(isAuth)
  async dogs() {
    return (await Dog.find({ relations: ["photos"] })) || {};
  }
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createDog(
    @Arg("name") name: string,
    @Arg("race") race: string,
    @Arg("telephone") telephone: string
  ) {
    await Dog.insert({
      name,
      race,
      telephone,
    });
    return true;
  }
}
