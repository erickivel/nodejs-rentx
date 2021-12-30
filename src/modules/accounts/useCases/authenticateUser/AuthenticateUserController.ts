import { Request, Response } from "express";
import { container } from "tsyringe";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

class AuthenticateUserController {
    async handle(reqest: Request, response: Response): Promise<Response> {
        const { email, password } = reqest.body;

        const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);

        const token = await authenticateUserUseCase.execute({ email, password });

        return response.json(token);
    }
}

export { AuthenticateUserController };