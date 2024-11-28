import { FilePhoto, uploadMultipleImages } from "../../../../utils/Firebase/FirebaseOperations"
import { ProductResponse } from "../../IMainProduct"
import PrismaProductRepositorie from "../../../repositorie/database/PrismaProductRepositorie"

const prismaProduct = new PrismaProductRepositorie()

const firebaseUploadProductsImgs = async (product_id: string, files: Array<FilePhoto>): Promise<ProductResponse> => {
    try {
        // Validações iniciais
        if (!files || files.length === 0) {
            throw { status_code: 404, body: "Nenhum arquivo enviado" };
        }

        if (!product_id) {
            throw { status_code: 403, body: "Nenhum parametro ID foi enviado" };
        }

        // Verifica se o produto existe
        const currentProduct = await prismaProduct.find({ product_id });
        if (!currentProduct) {
            throw { status_code: 404, body: "Produto não encontrado" };
        }

        // Valida cada arquivo
        for (const file of files) {
            if (file.mimetype !== 'image/png' && 
                file.mimetype !== 'image/jpg' && 
                file.mimetype !== 'image/jpeg') {
                throw { status_code: 500, body: "O arquivo precisa ser uma foto" };
            }

            const fileSizeInMB = file.size / (1024 * 1024);
            if (fileSizeInMB > 2) {
                throw { status_code: 500, body: "O arquivo é muito grande, máximo 2MB" };
            }
        }

        // Upload das imagens
        const images = await uploadMultipleImages('aukt-product-imgs', files);
        console.log("Imagens enviadas:", images);

        // Atualiza o produto com as novas URLs
        await prismaProduct.update({ group_imgs_url: images }, product_id);
        
        return { status_code: 201, body: { images } };

    } catch (error: any) {
        return { 
            status_code: error.status_code || 500, 
            body: error.message || error.body || "Erro interno do servidor" 
        };
    }
};

export default firebaseUploadProductsImgs;