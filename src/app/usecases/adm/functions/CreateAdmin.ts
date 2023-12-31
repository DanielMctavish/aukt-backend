
import bcrypt from 'bcrypt'
import PrismaAdminRepositorie from '../../../repositorie/database/PrismaAdminRepositorie'
import { IAdmin } from '../../../entities/IAdmin'
import { AdministratorResponse } from '../../IMainAdministrador'


export const createAdmin = async (data: IAdmin): Promise<AdministratorResponse> => {
    //console.log('dentro da função do cliente ---> ', data);

    const {
        email,
        password
    } = data

    return new Promise(async (resolve, reject) => {

        try {

            const administrador = new PrismaAdminRepositorie()
            const verifyAdmExisted = await administrador.findByEmail(email)
            if (verifyAdmExisted) return reject({ status_code: 403, body: { msg: 'este adm já existe' } })

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt)


            const currentClient = await administrador.create({ ...data, password: hash })
            resolve({ status_code: 200, body: { msg: 'administrador criado com sucesso', currentClient } })
        } catch (error: any) {

            reject({ status_code: 400, body: error.message })

        }
        
    })

}