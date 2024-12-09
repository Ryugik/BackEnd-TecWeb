import { createHash } from "crypto";
import Jwt from "jsonwebtoken";
import database from "../database.js";


export class AuthController {

static hashPassword(password: string): string{
    let hash = createHash("sha256"); 
    return hash.update(password).digest("hex")
}


static authToken(username: string): string{
    return Jwt.sign({user: username}, process.env.TOKEN_SECRET, {expiresIn: "1d"});
}


static async searchUsername(username: string, omitPassword = true) {
    const found = await database.user.findUnique({
      where: { username: username
      }, 
      omit: { password: omitPassword
      }
    });

    return found;
}


static  async login(data: {username: string, password: string}) {
    let user;
    user = await AuthController.searchUsername(data.username, false);

    if (!user || user.password !== AuthController.hashPassword(data.password)) {
      throw new Error("username e/o password incorretti");
    }
    //tuttappost
    return AuthController.authToken(data.username);
}


static  async register(user: {username: string, password: string}) {
  const search = await AuthController.searchUsername(user.username, true);

  if(!user.username || !user.password) {
    throw new Error("Inserire nome utente e password");
  }

  if (search){
    throw new Error("username gia' in uso, inserirne uno diverso!");
}

    const hashedPassword = AuthController.hashPassword(user.password);
    //Creazione nuovo utente
    return await database.user.create({
        data: {username: user.username, password: hashedPassword}})
}

}