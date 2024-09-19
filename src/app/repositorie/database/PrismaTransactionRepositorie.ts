import { PrismaClient } from "@prisma/client"
import { ITransaction } from "../../entities/ITransaction";
import { ITransactionRepositorie } from "../ITransactionRepositorie";

const prisma = new PrismaClient()

class PrismaTransactionRepositorie implements ITransactionRepositorie {

    async create(data: Partial<ITransaction>): Promise<ITransaction> {
        const { auction_cartela, advertiser, cartela_id, advertiser_id, amount, payment_method, ...restData } = data;

        const transactionData: any = {
            ...restData,
            amount: amount ?? 0,
            payment_method: payment_method ?? "Pix",
            Advertiser: {
                connect: {
                    id: advertiser_id
                }
            }
        };

        // Condicionalmente adiciona `auction_cartela` apenas se `cartela_id` for definido
        if (cartela_id) {
            transactionData.auction_cartela = {
                connect: {
                    id: cartela_id
                }
            };
        }

        const result = await prisma.transaction.create({
            data: transactionData
        });

        return result as ITransaction;
    }

    async find(transaction_id: string): Promise<ITransaction | null> {
        const result = await prisma.transaction.findFirst({ where: { id: transaction_id } })
        return result as ITransaction;
    }
    
    async list(advertiser_id: string): Promise<ITransaction[]> {
        const result = await prisma.transaction.findMany({ where: { advertiser_id: advertiser_id } })
        return result as ITransaction[];
    }

    async update(data: Partial<ITransaction>, transaction_id: string): Promise<ITransaction> {
        const { auction_cartela, advertiser, cartela_id, advertiser_id, amount, ...restData } = data

        const result = await prisma.transaction.update({
            where: {
                id: transaction_id
            },
            data: {
                ...restData,
                amount: amount,
                auction_cartela: {
                    connect: {
                        id: cartela_id
                    }
                },
                Advertiser: {
                    connect: {
                        id: advertiser_id
                    }
                }
            }
        })

        return result as ITransaction
    }

    async delete(transaction_id: string): Promise<ITransaction | null> {
        const result = await prisma.transaction.delete({ where: { id: transaction_id } })
        return result as ITransaction;
    }

}

export default PrismaTransactionRepositorie