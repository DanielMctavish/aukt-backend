import { PrismaClient } from "@prisma/client";
import { IAuctRepositorie } from "../IAuctRepositorie";
import { IAuct } from "../../entities/IAuct";
import { error } from "console";

const prisma = new PrismaClient();

class PrismaAuctRepositorie implements IAuctRepositorie {

    async create(data: IAuct): Promise<IAuct> {
        const { product_list, ...restData } = data;

        const createdAuct = await prisma.auct.create({
            data: {
                ...restData,
                product_list: {
                    create: !product_list ? [] : product_list
                }
            }
        });

        return createdAuct;
    }

    async find(id: string): Promise<IAuct | null> {
        const foundAuct = await prisma.auct.findFirst({
            where: {
                id,
            },
        });
        return foundAuct;
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

    async update(data: Partial<IAuct>, id: string): Promise<IAuct | null> {
        return new Promise((resolve, reject) => {
            prisma.auct.findUnique({
                where: {
                    id: id,
                },
            })
                .then(existingAuct => {
                    if (!existingAuct) {
                        reject(new Error(`Leilão com ID ${id} não encontrado.`));
                        return;
                    }

                    const {
                        accept_payment_methods,
                        auct_cover_img,
                        auct_date,
                        descriptions_informations,
                        limit_client,
                        limit_date,
                        tags,
                        terms_conditions,
                        title,
                        value,
                    } = data;

                    return prisma.auct.update({
                        where: {
                            id: id,
                        },
                        data: {
                            accept_payment_methods,
                            auct_cover_img,
                            auct_date,
                            descriptions_informations,
                            limit_client,
                            limit_date,
                            tags,
                            title,
                            value,
                            terms_conditions,
                        },
                    });
                })
                .then(updatedAuct => {
                    console.log('Resultado da atualização do leilão:', updatedAuct);
                    resolve(updatedAuct as IAuct);
                })
                .catch(error => {
                    console.error('Erro ao atualizar o leilão:', error);
                    reject(null);
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
                    resolve(deletedAuct);
                })
                .catch(error => {
                    reject(`erro ao tentar deletar leilão: ${error.message}`);
                });
        });
    }

}

export default PrismaAuctRepositorie;
