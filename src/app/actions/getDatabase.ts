'use server'

import prisma from "@/lib/db";

export const getDatabase = async () => {
      const getDrama = await prisma.drama.findMany();
      const getMovie = await prisma.movie.findMany();
      const personDB = await prisma.person.findMany();
      return {
        getDrama,
        getMovie,
        personDB,
      }
}