import { Dog } from "../entity/Dog";
import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { Photo } from "../entity/Photo";
import { savePhoto, readPhoto, getPhotosForGivenDog } from "../utils/photo";

@Resolver()
export class DogResolver {
  @Query(() => Dog)
  @UseMiddleware(isAuth)
  async dog(@Arg("id") id: string) {
    return {
      ...(await Dog.findOne(id, { relations: ["photos"] })),
      photos_data: getPhotosForGivenDog(id)
    }
       || {};
  }
  @Query(() => [Dog])
  @UseMiddleware(isAuth)
  async dogs() {
    return (
      await Dog.find({ relations: ["photos"] })
     || {});
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

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async addPhoto(@Arg("dogId") dogId: string, @Arg("content") content: string) {
    console.log("adding photo");
    const dog = await Dog.findOne(dogId, { relations: ["photos"] });
    if (dog) {
      const photo = new Photo();
      photo.dog = dog;
      //using Date.now() to make it more testable
      photo.filename = photo.dog.id + "_" + photo.dog.name + new Date(Date.now()).toISOString() + ".jpg";
      if (dog.photos) {
        //some photos exist
        dog.photos.push(photo);
      } else {
        //adding the first photo
        dog.photos = [photo];
      }
      await dog.save(); //we don't save photo manually because of cascade: true
      console.log(dog);
      savePhoto(photo, content);
      console.log(photo);
      return true;
    }
    return false;
  }
}
