import { FilePhoto, uploadMultipleImages } from "../../../../utils/Firebase/FirebaseOperations";
import { ProductResponse } from "../../IMainProduct";
import PrismaProductRepositorie from "../../../repositorie/database/PrismaProductRepositorie";

const prismaProduct = new PrismaProductRepositorie();

// Função auxiliar para remover espaços e caracteres especiais do nome do arquivo
const sanitizeFileName = (filename: string): string => {
    // Remove espaços e substitui por underscores
    return filename
        .replace(/\s+/g, '_') // Substitui espaços por '_'
        .replace(/[^a-zA-Z0-9._-]/g, '') // Remove caracteres especiais, mantendo letras, números, '.', '_', e '-'
        .toLowerCase(); // Converte para minúsculas para padronização
};

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

        // Valida cada arquivo e sanitiza o nome
        const sanitizedFiles: Array<FilePhoto> = files.map(file => {
            if (file.mimetype !== 'image/png' && 
                file.mimetype !== 'image/jpg' && 
                file.mimetype !== 'image/jpeg') {
                throw { status_code: 500, body: "O arquivo precisa ser uma foto" };
            }

            const fileSizeInMB = file.size / (1024 * 1024); // Correção: 1024*1024 para MB
            if (fileSizeInMB > 2) {
                throw { status_code: 500, body: "O arquivo é muito grande, máximo 2MB" };
            }

            // Sanitiza o nome do arquivo
            const sanitizedName = sanitizeFileName(file.originalname || `image_${Date.now()}`);
            return {
                ...file,
                originalname: sanitizedName
            };
        });

        // Upload das imagens com nomes sanitizados
        const images = await uploadMultipleImages('aukt-product-imgs', sanitizedFiles);

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