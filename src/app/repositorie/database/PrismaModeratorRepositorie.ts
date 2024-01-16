import { IModeratorRepositorie } from "../IModeratorRepositorie";
import { PrismaClient } from "@prisma/client"
import { IModerator } from "../../entities/IModerator";

const prisma = new PrismaClient()

class PrismaModeratorRepositorie implements IModeratorRepositorie {
    create(data: IModerator): Promise<IModerator> {
        return prisma.moderator.create({
            data
        })
    }
    find(moderator_id: string): Promise<IModerator | null> {
        return prisma.moderator.findUnique({
            where: {
                id: moderator_id
            }
        })
    }
    findByEmail(email: string): Promise<IModerator | null> {
        return prisma.moderator.findUnique({
            where: {
                email: email
            }
        })
    }
    list(): Promise<IModerator[]> {
        return prisma.moderator.findMany()
    }
    update(data: Partial<IModerator>, moderator_id: string): Promise<IModerator> {
        return prisma.moderator.update({
            where: {
                id: moderator_id
            },
            data
        })
    }
    delete(moderator_id: string): Promise<IModerator | null> {
        return prisma.moderator.delete({
            where: {
                id: moderator_id
            }
        })
    }
}

export default PrismaModeratorRepositorie