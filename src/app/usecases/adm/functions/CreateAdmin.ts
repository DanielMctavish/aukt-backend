
import bcrypt from 'bcrypt'


export const createAdmin = async (data: IAdministrador): Promise<AdministratorResponse> => {
    //console.log('dentro da função do cliente ---> ', data);

    const {
        email,
        senha
    } = data

    return new Promise(async (resolve, reject) => {
        try {

            const administrador = new Prisma()
            const verifyAdmExisted = await administrador.findByEmail(email)
            if (verifyAdmExisted) return reject({ status_code: 403, body: { msg: 'este adm já existe' } })

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(senha, salt)


            const currentClient = await administrador.create({ ...data, senha: hash })
            resolve({ status_code: 200, body: { msg: 'administrador criado com sucesso', currentClient } })
        } catch (error: any) {

            reject({ status_code: 400, body: error.message })

        }
    })

}