import prisma from "./db";
export const connectToDB = async () => {
    try {
        await prisma.$connect()
    } catch (error) {
        throw new Error("Failed to connect db")
    }
}