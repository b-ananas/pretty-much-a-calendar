import { readdir, readdirSync, readFileSync, writeFile } from "fs";
import { Photo } from "../entity/Photo";

const encoding = "base64";
const photoDir = __dirname + "/../../photos/"
//serialize photo to string
export const serializePhoto = (photo: Buffer) => photo.toString(encoding);

//deserialize photot to Buffer
export const deserializePhoto = (photo: string) => Buffer.from(photo, encoding);

//save in filesystem
export const savePhoto = (photo: Photo, content: string) => {
  writeFile(
    photoDir + photo.filename,
    deserializePhoto(content),
    () => {}
  );
};

export const readPhoto = (fileName: string) => {
  const data = readFileSync(photoDir + fileName);
  return serializePhoto(data);
}

export const getPhotosForGivenDog = (dogId: string) => {
  let answ: Array<string>;
  const files = readdirSync(photoDir)
  const filteredFiles = files.filter(file => file.startsWith("1"));
  console.log("filtered files: " + filteredFiles);
  answ = filteredFiles.map(file =>  readPhoto(file));
  return answ;
}
