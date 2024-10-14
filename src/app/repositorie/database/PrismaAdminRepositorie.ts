import { PrismaClient } from "@prisma/client"
import { IAdminRepositorie } from "../IAdminRepositorie";
import { IAdmin } from "../../entities/IAdmin";
import { ICreditCard } from "../../entities/ICreditCard";
import { IAdvertiser, PoliceStatus } from "../../entities/IAdvertiser";
import { IAuct } from "../../entities/IAuct";

const prisma = new PrismaClient()

class PrismaAdminRepositorie implements IAdminRepositorie {

    async create(data: IAdmin): Promise<IAdmin> {
        const { name, email, password, address, credit_cards } = data;

        const currentAdmin = await prisma.admin.create({
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

        return currentAdmin as IAdmin;
    }


    async find(admin_id: string): Promise<IAdmin | null> {

        const currentAdmin = await prisma.admin.findFirst({
            where: {
                id: admin_id
            }
        })
        return currentAdmin as IAdmin
    }

    async findByEmail(email: string): Promise<IAdmin | null> {
        const currentAdmin = await prisma.admin.findFirst({
            where: {
                email: email
            }
        })
        return currentAdmin as IAdmin
    }


    async list(): Promise<IAdmin[]> {

        const currentAdmin = await prisma.admin.findMany()

        return currentAdmin as IAdmin[]
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

        return updatedAdmin as IAdmin;
    }

    async listAllAdvertisers(): Promise<IAdvertiser[]> {
        const advertisers = await prisma.advertiser.findMany({
            include: {
                Aucts: {
                    include: {
                        Cartelas: true
                    }
                },
            }
        });

        return advertisers.map(advertiser => ({
            ...advertiser,
            amount: advertiser.amount || 0,
            police_status: advertiser.police_status as PoliceStatus || PoliceStatus.REGULAR,
            Aucts: advertiser.Aucts.map(auct => ({
                ...auct,
                Cartelas: auct.Cartelas
            }))
        })) as IAdvertiser[];
    }

    async listAllAuctions(): Promise<IAuct[]> {
        const auctions = await prisma.auct.findMany({
            include: {
                Cartelas: true,
                auct_dates: true
            }
        });
        return auctions as IAuct[];
    }

    async updateAdvertiserPoliceStatus(advertiserId: string, status: PoliceStatus): Promise<IAdvertiser> {

        const updatedAdvertiser = await prisma.advertiser.update({
            where: { id: advertiserId },
            data: { police_status: status } // Convertendo para string
        });

        return updatedAdvertiser as IAdvertiser
    }

    async getTotalCounts(): Promise<{ advertisersCount: number, clientsCount: number }> {
        const [advertisersCount, clientsCount] = await Promise.all([
            prisma.advertiser.count(),
            prisma.client.count()
        ]);
        return { advertisersCount, clientsCount };
    }
}

export default PrismaAdminRepositorie;
