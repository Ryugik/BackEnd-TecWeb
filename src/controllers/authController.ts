import { createHash, hash } from "crypto";
import Jwt from "jsonwebtoken";
import database from "../index.js";


export class AuthController {

static hashPassword(password: string): string{
    let hash = createHash("sha256"); 
    return hash.update(password).digest("hex")
}


static generateAuthToken(username: string): string{
    return Jwt.sign({user: username}, process.env.TOKEN_SECRET, {expiresIn: "1d"});
}


static async searchUsername(username: string, omitPassword = true) {
    const found = await database.user.findUnique({where: { username: username}, omit: {password: omitPassword}});
    return found;
}


  async login(data: {username: string, password: string}) {
    let user;
    user = await AuthController.searchUsername(data.username);
    if (!user || user.password !== AuthController.hashPassword(data.password)) {
      throw new Error("username e/o password incorretti");
    }
    //tuttappost
    return AuthController.generateAuthToken(data.username);
  }


  async register(user: {username: string, password: string}) {
    const hashedPassword = AuthController.hashPassword(user.password);
    //Creazione nuovo utente
    const newUser = await database.user.create({
        data: {username: user.username, password: hashedPassword}})
    }

}