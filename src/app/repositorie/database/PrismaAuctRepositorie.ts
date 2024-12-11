import { PrismaClient, Prisma } from "@prisma/client";
import { IAuctRepositorie } from "../IAuctRepositorie";
import { IAuct } from "../../entities/IAuct";

const prisma = new PrismaClient();

class PrismaAuctRepositorie implements IAuctRepositorie {

    async create(data: IAuct): Promise<IAuct | null> {
        const { product_list, advertiser_id, id, Cartelas, ...restData } = data;

        try {
            // Convertendo datas para o formato ISO-8601
            const auct_dates = data.auct_dates.map(date => ({
                ...date,
                date_auct: new Date(date.date_auct).toISOString()
            }));

            const createdAuct = await prisma.auct.create({
                data: {
                    ...restData,
                    public: data.public ?? false,
                    ...(advertiser_id && { advertiser_id }),

                    auct_dates: {
                        createMany: {
                            data: auct_dates,
                        }
                    },

                    ...(product_list && {
                        product_list: {
                            connect: product_list.map(product => ({
                                id: product.id
                            }))
                        }
                    }),

                    // Conectando `Cartelas` existentes
                    ...(Cartelas && Cartelas.length > 0 && {
                        Cartelas: {
                            connect: Cartelas.map(cartela => ({
                                id: cartela.id  // Conectando as cartelas pelo `id`
                            })),
                        }
                    }),

                    subscribed_clients: {
                        create: data.subscribed_clients?.map(subs => subs) || []
                    },

                    Bids: {
                        createMany: {
                            data: !data.Bid ? [] : data.Bid,
                        }
                    }
                }
            });

            console.log("Leilão criado com sucesso:", createdAuct);
            return createdAuct as IAuct;
        } catch (error) {
            console.log("Erro ao criar leilão:", error);
            return null;
        }
    }


    async find(id: string): Promise<IAuct | null> {
        const foundAuct = await prisma.auct.findFirst({
            where: {
                id,
            },
            include: {
                product_list: {
                    orderBy: {
                        lote: "asc"
                    }, include: {
                        Bid: {
                            orderBy: {
                                created_at: "desc"
                            },
                            include: {
                                Client: true
                            }
                        }
                    }
                },
                Advertiser: true,
                auct_dates: true
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
                    advertiser_id: creator_id
                }, include: {
                    product_list: {
                        select: {
                            Winner: true,
                            title: true,
                            auct_nanoid: true,
                            Bid: true,
                            group: true,
                            group_imgs_url: true,
                            lote: true,
                            id: true,
                            categorie: true,
                            created_at: true,
                            description: true,
                            initial_value: true,
                            reserve_value: true,
                            cover_img_url: true,
                            width: true,
                            height: true,
                            weight: true,
                            highlight_product: true
                        }
                    },
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
                    status: status,
                    public: true
                },
                include: {
                    product_list: true,
                    Advertiser: true,
                    auct_dates: true
                },
                orderBy: {
                    created_at: "desc"
                },
                take: 12
            });
            return aucts as IAuct[];
        } catch (error) {
            return []
        }

    }

    async update(data: Partial<IAuct>, auct_id: string): Promise<IAuct | null> {
        return new Promise((resolve, reject) => {
            prisma.auct.findUnique({
                where: {
                    id: auct_id,
                },
            }).then(existingAuct => {
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
                    status,
                    public: isPublic,
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
                        status,
                        public: isPublic,
                    },
                });
            }).then(updatedAuct => {
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
            }).then(deletedAuct => {
                console.log('Leilão deletado com sucesso:', deletedAuct);
                resolve(deletedAuct as IAuct);
            }).catch(error => {
                reject(`erro ao tentar deletar leilão: ${error.message}`);
            });

        });
    }

    //Count............................................................................

    async countAll(): Promise<number> {
        return await prisma.auct.count()
    }

    async countLive(): Promise<number> {
        return await prisma.auct.count({
            where: {
                status: 'live'
            }
        })
    }

    async countCataloged(): Promise<number> {
        return await prisma.auct.count({
            where: {
                status: 'cataloged'
            }
        })
    }

    async countFinished(): Promise<number> {
        return await prisma.auct.count({
            where: {
                status: 'finished'
            }
        })
    }

}

export default PrismaAuctRepositorie;
