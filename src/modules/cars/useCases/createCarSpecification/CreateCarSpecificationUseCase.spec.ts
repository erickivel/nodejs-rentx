import { CarsRepositoryInMemory } from "@modules/cars/repositories/In-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let carsRepositoryInMemory: CarsRepositoryInMemory;
let createCarSpecificationUseCase: CreateCarSpecificationUseCase;

describe("Create Car Specification", () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createCarSpecificationUseCase = new CreateCarSpecificationUseCase(carsRepositoryInMemory);
    })

    it("should be able to add a new specification to a non existing car", async () => {
        expect(async () => {
            const car_id = "1234";
            const specifications_id = ["54321"]

            await createCarSpecificationUseCase.execute({ car_id, specifications_id });
        }).rejects.toBeInstanceOf(AppError)
    });

    it("should be able to add a new specification to the car", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car Name",
            description: "Car Description",
            daily_rate: 100,
            license_plate: "123456",
            fine_amount: 60,
            brand: "Brand Name",
            category_id: "Category ID"
        });

        const specifications_id = ["54321"]

        await createCarSpecificationUseCase.execute({
            car_id: car.id,
            specifications_id
        });
    });
});