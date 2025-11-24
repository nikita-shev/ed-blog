export interface AuthInputDto {
    loginOrEmail: string;
    password: string;
}

export interface AuthOutputDto {
    email: string;
    login: string;
    userId: string;
}

export interface AccessToken {
    accessToken: string;
}
