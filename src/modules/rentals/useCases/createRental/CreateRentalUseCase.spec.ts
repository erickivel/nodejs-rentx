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
        const car = await carsRepositoryInMemory.create({
            name: "Car Test",
            description: "Car Test",
            daily_rate: 100,
            license_plate: "plate",
            fine_amount: 60,
            category_id: "1234",
            brand: "Car brand"
        });

        const rental = await createRentalUseCase.execute({
            user_id: "12345",
            car_id: car.id,
            expected_return_date: dayAdd24hours,
        });

        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("start_date");
    });

    it("should not be able to create a new rental if there is another open to the same user", async () => {
        await rentalsRepositoryInMemory.create({
            car_id: "123",
            expected_return_date: dayAdd24hours,
            user_id: "12345"
        });

        await expect(
            createRentalUseCase.execute({
                user_id: "12345",
                car_id: "Different car id",
                expected_return_date: dayAdd24hours,
            }),
        ).rejects.toEqual(new AppError("There is a rental in progress for users!"))
    });

    it("should not be able to create a new rental if there is another open to the same car", async () => {
        await rentalsRepositoryInMemory.create({
            car_id: "test",
            expected_return_date: dayAdd24hours,
            user_id: "12345"
        });

        await expect(
            createRentalUseCase.execute({
                user_id: "Not equal to 12345",
                car_id: "test",
                expected_return_date: dayAdd24hours,
            }),
        ).rejects.toEqual(new AppError("Car is unavailable"));
    });

    it("should not be able to create a new rental if invalid return date", async () => {
        await expect(
            createRentalUseCase.execute({
                user_id: "1",
                car_id: "1234",
                expected_return_date: dayjs().toDate(),
            }),
        ).rejects.toEqual(new AppError("Invalid return date!"));
    });
});