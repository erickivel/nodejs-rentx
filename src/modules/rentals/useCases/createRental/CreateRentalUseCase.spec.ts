import dayjs from "dayjs";

import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/In-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

import { AppError } from "@shared/errors/AppError";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/In-memory/CarsRepositoryInMemory";

let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let createRentalUseCase: CreateRentalUseCase;
let dayjsDateProvider: DayjsDateProvider;

describe("Create Rental", () => {
    const dayAdd24hours = dayjs().add(1, "day").toDate();

    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        carsRepositoryInMemory = new CarsRepositoryInMemory()
        dayjsDateProvider = new DayjsDateProvider();
        createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory, dayjsDateProvider, carsRepositoryInMemory);
    });

    it("should be able to create a rental", async () => {
        const rental = await createRentalUseCase.execute({
            user_id: "1234",
            car_id: "12313",
            expected_return_date: dayAdd24hours,
        });

        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("start_date");
    });

    it("should not be able to create a new rental if there is another open to the same user", async () => {
        expect(async () => {
            await createRentalUseCase.execute({
                user_id: "1234",
                car_id: "1",
                expected_return_date: dayAdd24hours,
            });

            const rental = await createRentalUseCase.execute({
                user_id: "1234",
                car_id: "Not equal to 1",
                expected_return_date: dayAdd24hours,
            });
        }).rejects.toBeInstanceOf(AppError)
    });

    it("should not be able to create a new rental if there is another open to the same car", async () => {
        expect(async () => {
            await createRentalUseCase.execute({
                user_id: "1",
                car_id: "1234",
                expected_return_date: dayAdd24hours,
            });

            await createRentalUseCase.execute({
                user_id: "Not equal to 1",
                car_id: "1234",
                expected_return_date: dayAdd24hours,
            });
        }).rejects.toBeInstanceOf(AppError)
    });

    it("should not be able to create a new rental if invalid return date", async () => {
        expect(async () => {
            await createRentalUseCase.execute({
                user_id: "1",
                car_id: "1234",
                expected_return_date: dayjs().toDate(),
            });
        }).rejects.toBeInstanceOf(AppError)
    });
});