import { Router } from 'express';
import { CreateUserController } from '../modules/accounts/useCases/createUser/CreateUserController';
import { CreateUserUseCase } from '../modules/accounts/useCases/createUser/CreateUserUseCase';

const usersRoutes = Router();

const createUserController = new CreateUserController();

usersRoutes.post("/", createUserController.handle);

export { usersRoutes };