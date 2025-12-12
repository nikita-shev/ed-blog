export interface AuthInputDto {
    loginOrEmail: string;
    password: string;
}

export interface AuthOutputDto {
    email: string;
    login: string;
    userId: string;
}

export type AccessToken = string;
export type RefreshToken = string;
export interface AuthorizationTokens {
    accessToken: AccessToken;
    refreshToken: RefreshToken;
}
export interface TokenOutputDto { // TODO: rename
    accessToken: AccessToken;
}

// registration ===>

export interface RegistrationInputDto {
    login: string;
    password: string;
    email: string;
}
