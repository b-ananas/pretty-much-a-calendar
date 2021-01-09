import { MiddlewareFn } from "type-graphql/dist/interfaces/Middleware";
import { MyContext } from "./MyContext";
import { verify } from "jsonwebtoken";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  // ex. bearer 120398kfdhjhdsak
  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    throw new Error("not authenticated");
  }
  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    //throws error when incorrect
    context.payload = payload as any;
  } catch (err) {
    console.log(err);
  }

  return next();
};
