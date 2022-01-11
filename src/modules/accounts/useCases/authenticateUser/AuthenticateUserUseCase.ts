import { inject, injectable } from "tsyringe";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import auth from "@config/auth";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";


interface IRequest {
    email: string,
    password: string
}

interface IResponse {
    user: {
        name: string,
        email: string
    },
    token: string;
    refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) { }

    async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(email);
        const {
            secretToken,
            expiresInToken,
            secretRefreshToken,
            expiresInRefreshToken,
            expiresRefreshTokenDays
        } = auth

        if (!user) {
            throw new AppError("Email or password incorrect");
        };

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new AppError("Email or password incorrect");
        };


        const token = sign({}, secretToken, {
            subject: user.id,
            expiresIn: expiresInToken
        });

        const refresh_token = sign({ email }, secretRefreshToken, {
            subject: user.id,
            expiresIn: expiresInRefreshToken
        })

        const refreshTokenExpiresDate = this.dateProvider.addDays(expiresRefreshTokenDays)

        await this.usersTokensRepository.create({
            user_id: user.id,
            expires_date: refreshTokenExpiresDate,
            refresh_token,
        });

        const tokenReturn: IResponse = {
            token,
            user: {
                name: user.name,
                email: user.email
            },
            refresh_token,
        };

        return tokenReturn;
    }
}

export { AuthenticateUserUseCase };