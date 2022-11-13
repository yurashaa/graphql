import { IUser } from './user.interfaces';

export interface IPost {
    id: number;
    content: string;
    image?: string;
    user: IUser;
}