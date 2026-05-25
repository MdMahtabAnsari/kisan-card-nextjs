import {User} from "better-auth";

export interface VerifyEmail {
    user: User;
    url: string;
    token: string;
}

export interface OTPEmail {
    email: string;
    otp: string;
}

export interface UrlEmail {
    email: string;
    url: string;
}

export interface UserUrlEmail {
    user: User;
    url: string;
    email: string;
}

export interface UserUrl{
    user: User;
    url: string;
}

export interface UserOTP {
    user: User;
    otp: string;
}
