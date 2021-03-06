
import { verify } from "jsonwebtoken";
import { User } from "../entity/User";
import { createAccessToken, createRefreshToken } from "../utils/auth";
import { Request, Response} from "express"; 
import { sendRefreshToken } from "../utils/sendRefreshToken";

export const refreshTokenMiddleware = async (req: Request, res: Response) => {
    const token = req.cookies.jabba;
    if (!token) {
      return res.send({ ok: false, accessToken: ""});
    }

    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) { //wrong token
      // console.log(err);
      return res.send({ ok: false, accessToken: ""});
    }

    //token is valid
    // we can send back an access token
    const user = await User.findOne({ id: payload.userId });

    if (!user) {
      return res.send({ ok: false, accessToken: ""});
    }

    if (user.tokenVersion != payload.tokenVersion) { //token was revoked
      return res.send({ ok: false, accessToken: ""});
    }
    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
}

