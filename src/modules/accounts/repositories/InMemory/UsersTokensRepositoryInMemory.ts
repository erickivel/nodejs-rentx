import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { UserTokens } from "@modules/accounts/infra/typeorm/entities/UserTokens";
import { IUsersTokensRepository } from "../IUsersTokensRepository";

class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
    usersTokens: UserTokens[] = [];

    async create({ expires_date, user_id, refresh_token }: ICreateUserTokenDTO): Promise<UserTokens> {
        const userTokens = new UserTokens();

        Object.assign(userTokens, {
            expires_date,
            user_id,
            refresh_token
        });

        this.usersTokens.push(userTokens);

        return userTokens;
    };

    async findByUserIdAndRefreshToken(user_id: string, refresh_token: string): Promise<UserTokens> {
        const userToken = this.usersTokens.find(ut => ut.user_id === user_id && ut.refresh_token === refresh_token);

        return userToken;
    };

    async deleteById(id: string): Promise<void> {
        const userToken = this.usersTokens.find(ut => ut.id === id);

        this.usersTokens.splice(this.usersTokens.indexOf(userToken), 1);
    };

    async findByRefreshToken(refresh_token: string): Promise<UserTokens> {
        const userToken = this.usersTokens.find(ut => ut.refresh_token === refresh_token);

        return userToken;
    };
};

export { UsersTokensRepositoryInMemory };