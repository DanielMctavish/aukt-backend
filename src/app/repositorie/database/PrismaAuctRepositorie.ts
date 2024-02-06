import { PrismaClient } from "@prisma/client";
import { IAuctRepositorie } from "../IAuctRepositorie";
import { IAuct } from "../../entities/IAuct";

const prisma = new PrismaClient();

class PrismaAuctRepositorie implements IAuctRepositorie {

    async create(data: IAuct): Promise<IAuct> {
        const { product_list, ...restData } = data;

        console.log('observando datas -> ', data.auct_dates);
        

        const createdAuct = await prisma.auct.create({
            data: {
                ...restData,
                product_list: {
                    create: !product_list ? [] : product_list
                },
                subscribed_clients: {
                    create: !data.subscribed_clients ? [] : data.subscribed_clients
                },
                Bids: {
                    create: !data.Bid ? [] : data.Bid
                }
            }
        });

        return createdAuct as IAuct;
    }

    async find(id: string): Promise<IAuct | null> {
        const foundAuct = await prisma.auct.findFirst({
            where: {
                id,
            },
        });
        return foundAuct as IAuct;
    }

    async list(creator_id: string): Promise<IAuct[]> {

        console.log('dentro do prisma list auct -> ', creator_id);


        const aucts = await prisma.auct.findMany({
            where: {
                creator_id
            }, include: {
                product_list: true
            }
        });
        return aucts as IAuct[];

    }

    async update(data: Partial<IAuct>, auct_id: string): Promise<IAuct | null> {
        console.log('observando update client--> ', data.client_id);

        return new Promise((resolve, reject) => {
            prisma.auct.findUnique({
                where: {
                    id: auct_id,
                },
            })
                .then(existingAuct => {
                    if (!existingAuct) {
                        reject(new Error(`Leilão com ID ${auct_id} não encontrado.`));
                        return;
                    }

                    const {
                        accept_payment_methods,
                        auct_cover_img,
                        auct_dates,
                        descriptions_informations,
                        limit_client,
                        limit_date,
                        tags,
                        terms_conditions,
                        title,
                        value,
                        client_id
                    } = data;

                    return prisma.auct.update({
                        where: {
                            id: auct_id,
                        },
                        data: {
                            accept_payment_methods,
                            auct_cover_img,
                            auct_dates,
                            descriptions_informations,
                            limit_client,
                            limit_date,
                            tags,
                            title,
                            value,
                            terms_conditions,
                            subscribed_clients: {
                                connect: {
                                    id: client_id
                                }
                            }
                        },
                    });
                })
                .then(updatedAuct => {
                    resolve(updatedAuct as IAuct);
                })
                .catch(error => {
                    reject(error.message);
                });
        });
    }




    async delete(id: string): Promise<IAuct | null> {
        return new Promise(async (resolve, reject) => {

            const currentAuct = await prisma.auct.findUnique({
                where: {
                    id: id,
                },
            })
            if (!currentAuct) return reject(`not auct founded by id: ${id}`)

            await prisma.auct.delete({
                where: {
                    id,
                },
            })
                .then(deletedAuct => {
                    console.log('Leilão deletado com sucesso:', deletedAuct);
                    resolve(deletedAuct as IAuct);
                })
                .catch(error => {
                    reject(`erro ao tentar deletar leilão: ${error.message}`);
                });
        });
    }

}

export default PrismaAuctRepositorie;
