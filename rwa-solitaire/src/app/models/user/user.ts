export interface User {
    id: number;
    createdAt: Date;
    username: string;
    email: string;
    firstname?: string;
    lastname?: string;
}