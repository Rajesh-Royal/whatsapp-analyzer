import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export const serverSession = async () => await getServerSession(authOptions);