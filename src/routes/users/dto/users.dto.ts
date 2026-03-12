export interface UserInputDto {
    login: string;
    password: string;
    email: string;
}

export interface UserOutputDto {
    id: string;
    login: string;
    email: string;
    createdAt: string;
}
