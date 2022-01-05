import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/In-memory/RentalsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateRentalUseCase } from "./createRentalUseCase";

let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let createRentalUseCase: CreateRentalUseCase

describe("Create Rental", () => {
    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory);
    });

    it("should be able to create a rental", async () => {
        const rental = await createRentalUseCase.execute({
            user_id: "1234",
            car_id: "12313",
            expected_return_date: new Date()
        });

        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("start_date");
    });

    it("should not be able to create a new rental if there is another open to the same user", async () => {
        expect(async () => {
            await createRentalUseCase.execute({
                user_id: "1234",
                car_id: "1",
                expected_return_date: new Date()
            });

            const rental = await createRentalUseCase.execute({
                user_id: "1234",
                car_id: "Not equal to 1",
                expected_return_date: new Date()
            });
        }).rejects.toBeInstanceOf(AppError)
    });

    it("should not be able to create a new rental if there is another open to the same car", async () => {
        expect(async () => {
            await createRentalUseCase.execute({
                user_id: "1",
                car_id: "1234",
                expected_return_date: new Date()
            });

            const rental = await createRentalUseCase.execute({
                user_id: "Not equal to 1",
                car_id: "1234",
                expected_return_date: new Date()
            });
        }).rejects.toBeInstanceOf(AppError)
    });
});