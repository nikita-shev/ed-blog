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

// registration ===>

export interface RegistrationInputDto {
    login: string;
    password: string;
    email: string;
}
