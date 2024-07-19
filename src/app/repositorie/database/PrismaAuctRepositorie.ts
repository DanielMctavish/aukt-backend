import { PrismaClient } from "@prisma/client";
import { IAuctRepositorie } from "../IAuctRepositorie";
import { IAuct } from "../../entities/IAuct";
import dayjs from "dayjs";

const prisma = new PrismaClient();

class PrismaAuctRepositorie implements IAuctRepositorie {

    async create(data: IAuct): Promise<IAuct> {
        const { product_list, ...restData } = data;

        const createdAuct = await prisma.auct.create({
            data: {
                ...restData,
                auct_dates: {
                    createMany: {
                        data: data.auct_dates.map(group => {
                            return {
                                date_auct: new Date(group.date_auct),
                                group: group.group,
                                hour: group.hour
                            }
                        })
                    }
                },
                product_list: {
                    createMany: {
                        data: product_list?.map(product => {
                            return product;
                        }) || []
                    }
                },
                subscribed_clients: {
                    create: data.subscribed_clients?.map(subs => {
                        return subs;
                    }) || []
                },
                Bids: {
                    createMany: {
                        data: !data.Bid ? [] : data.Bid
                    }
                }
            }
        })



        return createdAuct as IAuct;
    }


    async find(id: string): Promise<IAuct | null> {

        const foundAuct = await prisma.auct.findFirst({
            where: {
                id,
            }, include: {
                product_list: true,
                Advertiser: true
            }
        });
        return foundAuct as IAuct;
    }

    async findByNanoId(nano_id: string): Promise<IAuct | null> {

        const foundAuct = await prisma.auct.findUnique({
            where: {
                nano_id
            }
        });
        return foundAuct as IAuct;

    }

    async list(creator_id: string): Promise<IAuct[]> {

        try {
            const aucts = await prisma.auct.findMany({
                where: {
                    creator_id
                }, include: {
                    product_list: true,
                    Advertiser: true,
                    auct_dates: true
                }, orderBy: {
                    created_at: "asc"
                }
            });
            return aucts as IAuct[];
        } catch (error) {
            return [];
        }

    }

    async listByStatus(status: any): Promise<IAuct[]> {

        try {
            const aucts = await prisma.auct.findMany({
                where: {
                    status: status
                }, include: {
                    product_list: true,
                    Advertiser: true,
                    auct_dates: true
                }, orderBy: {
                    created_at: "desc"
                }, take: 12
            });
            return aucts as IAuct[];
        } catch (error) {
            return []
        }

    }

    async update(data: Partial<IAuct>, auct_id: string): Promise<IAuct | null> {
        //console.log('observando update client--> ', data, auct_id);

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
                        auct_cover_img,
                        descriptions_informations,
                        tags,
                        terms_conditions,
                        title,
                        categorie,
                        status
                    } = data;

                    return prisma.auct.update({
                        where: {
                            id: auct_id,
                        },
                        data: {
                            auct_cover_img,
                            descriptions_informations,
                            tags,
                            title,
                            terms_conditions,
                            categorie,
                            status
                        },
                    });
                })
                .then(updatedAuct => {
                    resolve(updatedAuct as IAuct);
                }).catch(error => {
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
