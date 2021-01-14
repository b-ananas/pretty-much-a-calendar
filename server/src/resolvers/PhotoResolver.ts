import { Dog } from "../entity/Dog";
import { Arg, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { Photo } from "../entity/Photo";

@Resolver()
export class PhotoResolver {
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