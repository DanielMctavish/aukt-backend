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
                            create: data.header.texts.map(text => ({
                                title: text.title,
                                content: text.content,
                                positionTop: text.positionTop,
                                positionLeft: text.positionLeft,
                                positionWidth: text.positionWidth,
                                titleBackground: text.titleBackground,
                                titleColor: text.titleColor,
                                contentColor: text.contentColor,
                                titleSize: text.titleSize,
                                titleBorderRadius: text.titleBorderRadius,
                                visible: text.visible
                            }))
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
                    companyName: data.footer.companyName,
                    showSocialLinks: data.footer.showSocialLinks,
                    textColor: data.footer.textColor,
                    borderColor: data.footer.borderColor,
                    elementsOpacity: data.footer.elementsOpacity,
                    sections: {
                        create: data.footer.sections.map(section => ({
                            title: section.title,
                            links: {
                                create: section.links
                            }
                        }))
                    },
                    socialLinks: {
                        create: data.footer.socialLinks
                    }
                }
            });

            // Criar o Template com as referências
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
                            sections: {
                                include: {
                                    links: true
                                }
                            },
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

    async Find(advertiser_id: string): Promise<ISiteTemplate[]> {
        const templates = await prisma.siteTemplate.findMany({
            where: {
                advertiserId: advertiser_id
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
                        sections: {
                            include: {
                                links: true
                            }
                        },
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
                        sections: {
                            include: {
                                links: true
                            }
                        },
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
                    await prisma.templateHeader.update({
                        where: { id: currentTemplate.headerId },
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
                                deleteMany: {},
                                create: data.header.texts.map(text => ({
                                    title: text.title,
                                    content: text.content,
                                    positionTop: text.positionTop,
                                    positionLeft: text.positionLeft,
                                    positionWidth: text.positionWidth,
                                    titleBackground: text.titleBackground,
                                    titleColor: text.titleColor,
                                    contentColor: text.contentColor,
                                    titleSize: text.titleSize,
                                    titleBorderRadius: text.titleBorderRadius,
                                    visible: text.visible
                                }))
                            },
                            carousel: data.header.carousel ? {
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
                            } : undefined
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
                            companyName: data.footer.companyName,
                            showSocialLinks: data.footer.showSocialLinks,
                            textColor: data.footer.textColor,
                            borderColor: data.footer.borderColor,
                            elementsOpacity: data.footer.elementsOpacity,
                            sections: {
                                deleteMany: {},
                                create: data.footer.sections.map(section => ({
                                    title: section.title,
                                    links: {
                                        create: section.links
                                    }
                                }))
                            },
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
                            sections: {
                                include: {
                                    links: true
                                }
                            },
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
                            sections: {
                                include: {
                                    links: true
                                }
                            },
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