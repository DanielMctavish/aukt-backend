import { IAdmin } from "../entities/IAdmin"



export interface IAdminRepositorie {
    create(data: IAdmin): Promise<IAdmin>
    find(administrador_id: string): Promise<IAdmin | null>
    list(): Promise<IAdmin[]>
    findByEmail(email: string): Promise<IAdmin | null>
    update(data: Partial<IAdmin>,admin_id: string): Promise<IAdmin>
}