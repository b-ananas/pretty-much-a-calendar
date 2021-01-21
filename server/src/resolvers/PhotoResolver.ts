import { Dog } from "../entity/Dog";
import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { Photo } from "../entity/Photo";
import { readFile, readFileSync } from "fs";
import { savePhoto, serializePhoto } from "../utils/photo";

@Resolver()
export class PhotoResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async addPhoto(@Arg("dogId") dogId: string, @Arg("desc") desc: string) {
    console.log("adding photo");
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
      await dog.save(); //we don't save photo because of cascade: true
      console.log(dog);
      savePhoto(desc);
      console.log(photo);
      return true;
    }
    return false;
  }

  // @UseMiddleware(isAuth)
  //temporary endpoint
  //used to test how to store photos in db
  //opens a photo from filesystem and returns it as text which can be saved in db

  //alternatively, store images in filesystem - maybe better?
  @Query(() => String)
  async getPhoto() {
    // console.log(`getting photo no. ${photoId}`);
    const data = readFileSync(__dirname + "/../../photos/example.jpg");
    const answ = serializePhoto(data);
    if (!answ) {
      throw new Error("failed to open a photo!");
    }
    return answ;
  }


  //temporary endpoint for uploading a photo.
  //for some reason, 
  @Mutation(()=> Boolean)
  async createPhoto(@Arg("photo") photo: string) {
    savePhoto(photo)
    return true;
  }
}
