import { getToken } from "@/models/tokenModel.js";
import { getUser } from "@/models/userModel.js";

export async function getUserFromToken(token: string) {
  try {
    const tokenId = token.split("|")[0];
    if (!tokenId) {
      throw new Error("No token ID found");
    }
    const foundToken = await getToken({ tokenId: tokenId });
    if (!foundToken) {
      throw new Error("Token does not exist");
    }
    const userId = foundToken.userId;
    const user = await getUser({ id: userId });

    if (!user) {
      return null;
    }
    return user;
  } catch (err) {
    throw err;
  }
}
