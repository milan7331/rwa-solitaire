export interface UserResponseDto {
    id: number;
    createdAt: Date;
    username: string;
    email: string;
    firstname?: string;
    lastname?: string;
}