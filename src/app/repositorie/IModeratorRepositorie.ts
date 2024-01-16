import { IModerator } from "../entities/IModerator"


export interface IModeratorRepositorie {
    create(data: IModerator): Promise<IModerator>
    find(moderator_id: string): Promise<IModerator | null>
    findByEmail(email: string): Promise<IModerator | null>
    list(): Promise<IModerator[]>
    update(data: Partial<IModerator>, moderator_id: string): Promise<IModerator>
    delete(moderator_id: string): Promise<IModerator | null>
}