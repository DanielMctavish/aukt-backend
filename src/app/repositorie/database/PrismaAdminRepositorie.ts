import { PrismaClient } from "@prisma/client"
import { IAdminRepositorie } from "../IAdminRepositorie";
import { IAdmin } from "../../entities/IAdmin";
import { ICreditCard } from "../../entities/ICreditCard";

const prisma = new PrismaClient()

class PrismaAdminRepositorie implements IAdminRepositorie {

    async create(data: IAdmin): Promise<IAdmin> {
        const { name, email, password, address, credit_cards } = data;

        const createdAdmin = await prisma.admin.create({
            data: {
                name,
                email,
                password,
                address,
                credit_cards: {
                    connect: credit_cards?.map((card: ICreditCard) => ({
                        id: card.id
                    })) || []
                }
            }
        });

        return createdAdmin;
    }


    async find(admin_id: string): Promise<IAdmin | null> {

        return await prisma.admin.findFirst({
            where: {
                id: admin_id
            }
        })

    }

    async findByEmail(email: string): Promise<IAdmin | null> {
        return await prisma.admin.findFirst({
            where: {
                email: email
            }
        })
    }


    async list(): Promise<IAdmin[]> {

        return await prisma.admin.findMany()

    }

    async update(data: Partial<IAdmin>, admin_id: string): Promise<IAdmin> {
        const { credit_cards, ...restData } = data;

        const updatedAdmin = await prisma.admin.update({
            where: {
                id: admin_id
            },
            data: {
                ...restData,
                credit_cards: {
                    connect: credit_cards?.map((card: ICreditCard) => ({
                        id: card.id
                    })) || []
                }
            }
        });

        return updatedAdmin;
    }

}

export default PrismaAdminRepositorie;