import { writeFile } from "fs";

const encoding = "base64";
export const serializePhoto = (photo: Buffer) => photo.toString(encoding);
export const deserializePhoto = (photo: string) => Buffer.from(photo, encoding);
export const savePhoto = (photo: string) => {
  writeFile(
    __dirname + "/../../photos/dupas.jpg",
    deserializePhoto(photo),
    () => {}
  );
};
