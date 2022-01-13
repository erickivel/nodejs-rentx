import { AppError } from "@shared/errors/AppError";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/InMemory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "@modules/accounts/useCases/createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/InMemory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";

describe("Authenticate User", () => {
    let usersRepositoryInMemory: UsersRepositoryInMemory;
    let createUserUseCase: CreateUserUseCase;
    let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
    let authenticateUserUseCase: AuthenticateUserUseCase;
    let dateProvider: DayjsDateProvider;

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
        dateProvider = new DayjsDateProvider();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory, usersTokensRepositoryInMemory, dateProvider);
    });

    it("should be able to authenticate a user", async () => {
        const user: ICreateUserDTO = {
            name: "John",
            email: "john.doe:@gmail.com",
            password: "password",
            driver_license: "123456"
        }

        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        });

        expect(result).toHaveProperty("token");
    });

    it("should not be abel to authenticate an non existing user", async () => {
        await expect(
            authenticateUserUseCase.execute({
                email: "false@gmail.com",
                password: "password"
            }),
        ).rejects.toEqual(new AppError("Email or password incorrect"));
    });

    it("should not be able to authenticate with incorrect password", async () => {
        const user: ICreateUserDTO = {
            name: "John Doe",
            email: "john.doe@gmail.com",
            password: "password",
            driver_license: "123456",
        }

        await createUserUseCase.execute(user);

        await expect(
            authenticateUserUseCase.execute({
                email: user.email,
                password: "wrong password"
            }),
        ).rejects.toEqual(new AppError("Email or password incorrect"));
    });
});