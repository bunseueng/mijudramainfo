import prisma from "@/lib/db";

export async function getPersonId(personId: string) {
    try {
        const person = await prisma.person.findUnique({
            where: {
                personId: personId,
            }
        })
        return person
    } catch (error: any) {
        throw new Error(error)        
    }
}