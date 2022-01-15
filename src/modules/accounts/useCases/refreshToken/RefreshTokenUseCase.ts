import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { AppError } from "@shared/errors/AppError";

import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";

interface IPayload {
    sub: string;
    email: string;
};

interface ITokenResponse {
    token: string;
    refresh_token: string;
}
@injectable()
class RefreshTokenUseCase {
    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DateProvider")
        private dateProvider: IDateProvider
    ) { }

    async execute(token: string): Promise<ITokenResponse> {
        const {
            secretRefreshToken,
            expiresInRefreshToken,
            expiresRefreshTokenDays,
            secretToken,
            expiresInToken
        } = auth

        const { email, sub } = verify(token, secretRefreshToken) as IPayload;

        const user_id = sub;

        const userToken = await this.usersTokensRepository.findByUserIdAndRefreshToken(
            user_id,
            token
        );

        if (!userToken) {
            throw new AppError("Refresh Token does not exists!");
        };

        await this.usersTokensRepository.deleteById(userToken.id);

        const refresh_token = sign({ email }, secretRefreshToken, {
            subject: sub,
            expiresIn: expiresInRefreshToken
        });

        const expires_date = this.dateProvider.addDays(expiresRefreshTokenDays)

        await this.usersTokensRepository.create({
            expires_date,
            refresh_token,
            user_id,
        });

        const newToken = sign({}, secretToken, {
            subject: user_id,
            expiresIn: expiresInToken
        });

        return {
            refresh_token,
            token: newToken
        };
    }
};

export { RefreshTokenUseCase };