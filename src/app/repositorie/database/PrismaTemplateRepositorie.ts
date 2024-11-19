import { PrismaClient } from "@prisma/client"
import { ISiteTemplate } from "../../entities/ISiteTemplate";
import ITemplateRepositorie from "../ITemplateRepositorie";

const prisma = new PrismaClient()

class PrismaTemplateRepositorie implements ITemplateRepositorie {

    async Create(data: ISiteTemplate): Promise<ISiteTemplate> {
        try {
            if (!data.footer || !data.footer.companyName) {
                throw new Error("Footer company name is required");
            }

            // Primeiro criar o Header se existir
            let headerId: string | undefined;
            if (data.header) {
                const header = await prisma.templateHeader.create({
                    data: {
                        color: data.header.color,
                        sizeType: data.header.sizeType,
                        model: data.header.model,
                        backgroundImage: data.header.backgroundImage,
                        backgroundImageOpacity: data.header.backgroundImageOpacity,
                        backgroundImageBlur: data.header.backgroundImageBlur,
                        backgroundImageBrightness: data.header.backgroundImageBrightness,
                        elementsOpacity: data.header.elementsOpacity,
                        texts: {
                            create: data.header.texts
                        },
                        carousel: data.header.carousel ? {
                            create: {
                                enabled: data.header.carousel.enabled,
                                title: data.header.carousel.title,
                                selectedAuctId: data.header.carousel.selectedAuctId,
                                sizeWidth: data.header.carousel.sizeWidth,
                                sizeHeight: data.header.carousel.sizeHeight,
                                itemsToShow: data.header.carousel.itemsToShow,
                                speed: data.header.carousel.speed,
                                positionTop: data.header.carousel.positionTop,
                                positionLeft: data.header.carousel.positionLeft,
                                showTitle: data.header.carousel.showTitle,
                                showPrice: data.header.carousel.showPrice,
                                showCarouselTitle: data.header.carousel.showCarouselTitle,
                                showNavigation: data.header.carousel.showNavigation
                            }
                        } : undefined
                    }
                });
                headerId = header.id;
            }

            // Criar o Footer
            const footer = await prisma.templateFooter.create({
                data: {
                    color: data.footer.color,
                    sizeType: data.footer.sizeType,
                    sections: JSON.stringify(data.footer.sections || {}),
                    companyName: data.footer.companyName,
                    showSocialLinks: data.footer.showSocialLinks,
                    textColor: data.footer.textColor,
                    borderColor: data.footer.borderColor,
                    elementsOpacity: data.footer.elementsOpacity,
                    socialLinks: {
                        create: data.footer.socialLinks
                    }
                }
            });

            // Criar o Template
            const result = await prisma.siteTemplate.create({
                data: {
                    advertiserId: data.advertiserId,
                    colorPalette: data.colorPalette,
                    fontStyle: data.fontStyle,
                    headerId: headerId,
                    footerId: footer.id,
                    sections: {
                        create: data.sections.map(section => ({
                            type: section.type,
                            color: section.color,
                            sizeType: section.sizeType,
                            config: section.config as any
                        }))
                    }
                },
                include: {
                    sections: true,
                    advertiser: true,
                    header: {
                        include: {
                            texts: true,
                            carousel: true
                        }
                    },
                    footer: {
                        include: {
                            socialLinks: true
                        }
                    }
                }
            });

            return result as unknown as ISiteTemplate;
        } catch (error) {
            console.error("Error in Create:", error);
            throw error;
        }
    }

    async Find(advertiserId: string): Promise<ISiteTemplate[]> {
        const templates = await prisma.siteTemplate.findMany({
            where: {
                advertiserId: advertiserId
            },
            include: {
                sections: true,
                advertiser: true,
                header: {
                    include: {
                        texts: true,
                        carousel: true
                    }
                },
                footer: {
                    include: {
                        socialLinks: true
                    }
                }
            }
        });

        return templates as unknown as ISiteTemplate[];
    }

    async FindById(template_id: string): Promise<ISiteTemplate> {
        const template = await prisma.siteTemplate.findUnique({
            where: {
                id: template_id
            },
            include: {
                sections: true,
                advertiser: true,
                header: {
                    include: {
                        texts: true,
                        carousel: true
                    }
                },
                footer: {
                    include: {
                        socialLinks: true
                    }
                }
            }
        });

        if (!template) {
            throw new Error("Template not found");
        }

        return template as unknown as ISiteTemplate;
    }

    async Update(data: Partial<ISiteTemplate>, template_id: string): Promise<ISiteTemplate> {
        try {
            // Atualizar Header se existir
            if (data.header) {
                const currentTemplate = await prisma.siteTemplate.findUnique({
                    where: { id: template_id },
                    include: { header: true }
                });

                if (currentTemplate?.headerId) {
                    // Log para debug
                    console.log("Header model being updated to:", data.header.model);
                    
                    await prisma.templateHeader.update({
                        where: { id: currentTemplate.headerId },
                        data: {
                            ...(data.header.color && { color: data.header.color }),
                            ...(data.header.sizeType && { sizeType: data.header.sizeType }),
                            ...(data.header.model && { model: data.header.model }),
                            ...(data.header.backgroundImage !== undefined && { 
                                backgroundImage: data.header.backgroundImage 
                            }),
                            ...(data.header.backgroundImageOpacity !== undefined && { 
                                backgroundImageOpacity: data.header.backgroundImageOpacity 
                            }),
                            ...(data.header.backgroundImageBlur !== undefined && { 
                                backgroundImageBlur: data.header.backgroundImageBlur 
                            }),
                            ...(data.header.backgroundImageBrightness !== undefined && { 
                                backgroundImageBrightness: data.header.backgroundImageBrightness 
                            }),
                            ...(data.header.elementsOpacity !== undefined && { 
                                elementsOpacity: data.header.elementsOpacity 
                            }),
                            ...(data.header.texts && {
                                texts: {
                                    deleteMany: {},
                                    create: data.header.texts
                                }
                            }),
                            ...(data.header.carousel && {
                                carousel: {
                                    upsert: {
                                        create: {
                                            enabled: data.header.carousel.enabled,
                                            title: data.header.carousel.title,
                                            selectedAuctId: data.header.carousel.selectedAuctId,
                                            sizeWidth: data.header.carousel.sizeWidth,
                                            sizeHeight: data.header.carousel.sizeHeight,
                                            itemsToShow: data.header.carousel.itemsToShow,
                                            speed: data.header.carousel.speed,
                                            positionTop: data.header.carousel.positionTop,
                                            positionLeft: data.header.carousel.positionLeft,
                                            showTitle: data.header.carousel.showTitle,
                                            showPrice: data.header.carousel.showPrice,
                                            showCarouselTitle: data.header.carousel.showCarouselTitle,
                                            showNavigation: data.header.carousel.showNavigation
                                        },
                                        update: {
                                            enabled: data.header.carousel.enabled,
                                            title: data.header.carousel.title,
                                            selectedAuctId: data.header.carousel.selectedAuctId,
                                            sizeWidth: data.header.carousel.sizeWidth,
                                            sizeHeight: data.header.carousel.sizeHeight,
                                            itemsToShow: data.header.carousel.itemsToShow,
                                            speed: data.header.carousel.speed,
                                            positionTop: data.header.carousel.positionTop,
                                            positionLeft: data.header.carousel.positionLeft,
                                            showTitle: data.header.carousel.showTitle,
                                            showPrice: data.header.carousel.showPrice,
                                            showCarouselTitle: data.header.carousel.showCarouselTitle,
                                            showNavigation: data.header.carousel.showNavigation
                                        }
                                    }
                                }
                            })
                        }
                    });
                }
            }

            // Atualizar Footer se existir
            if (data.footer) {
                const currentTemplate = await prisma.siteTemplate.findUnique({
                    where: { id: template_id },
                    include: { footer: true }
                });

                if (currentTemplate?.footerId) {
                    await prisma.templateFooter.update({
                        where: { id: currentTemplate.footerId },
                        data: {
                            color: data.footer.color,
                            sizeType: data.footer.sizeType,
                            sections: JSON.stringify(data.footer.sections || {}),
                            companyName: data.footer.companyName,
                            showSocialLinks: data.footer.showSocialLinks,
                            textColor: data.footer.textColor,
                            borderColor: data.footer.borderColor,
                            elementsOpacity: data.footer.elementsOpacity,
                            socialLinks: data.footer.socialLinks ? {
                                upsert: {
                                    create: data.footer.socialLinks,
                                    update: data.footer.socialLinks
                                }
                            } : undefined
                        }
                    });
                }
            }

            // Atualizar Template
            const result = await prisma.siteTemplate.update({
                where: {
                    id: template_id
                },
                data: {
                    colorPalette: data.colorPalette,
                    fontStyle: data.fontStyle,
                    sections: data.sections ? {
                        deleteMany: {},
                        create: data.sections.map(section => ({
                            type: section.type,
                            color: section.color,
                            sizeType: section.sizeType,
                            config: section.config as any
                        }))
                    } : undefined
                },
                include: {
                    sections: true,
                    advertiser: true,
                    header: {
                        include: {
                            texts: true,
                            carousel: true
                        }
                    },
                    footer: {
                        include: {
                            socialLinks: true
                        }
                    }
                }
            });

            return result as unknown as ISiteTemplate;
        } catch (error) {
            console.error("Error in Update:", error);
            throw error;
        }
    }

    async Delete(template_id: string): Promise<ISiteTemplate> {
        try {
            const template = await prisma.siteTemplate.findUnique({
                where: { id: template_id },
                include: {
                    sections: true,
                    header: {
                        include: {
                            texts: true,
                            carousel: true
                        }
                    },
                    footer: {
                        include: {
                            socialLinks: true
                        }
                    }
                }
            });

            if (!template) {
                throw new Error("Template not found");
            }

            // Com onDelete: Cascade, apenas deletar o template é suficiente
            await prisma.siteTemplate.delete({
                where: { id: template_id }
            });

            return template as unknown as ISiteTemplate;
        } catch (error) {
            console.error("Error in Delete:", error);
            throw error;
        }
    }
}

export default PrismaTemplateRepositorie