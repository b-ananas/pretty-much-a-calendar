import { Dog } from "../entity/Dog";
import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../auth/isAuth";
import { Photo } from "../entity/Photo";

@Resolver()
export class DogResolver {
  @Query(() => Dog)
  @UseMiddleware(isAuth)
  async dog(@Arg("id") id: string) {
    return (await Dog.findOne(id, { relations: ["photos"] })) || {};
  }
  @Query(() => Photo)
  @UseMiddleware(isAuth)
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
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async addPhoto(@Arg("dogId") dogId: string, @Arg("desc") desc: string) {
    const dog = await Dog.findOne(dogId, { relations: ["photos"] });
    if (dog) {
      const photo = new Photo();
      photo.desc = desc;
      photo.dog = dog;
      if (dog.photos) {
        //some photos exist
        dog.photos.push(photo);
      } else {
        //adding the first photo
        dog.photos = [photo];
      }
      dog.save(); //we don't save photo because of cascade: true
      return true;
    }
    return false;
  }
}
