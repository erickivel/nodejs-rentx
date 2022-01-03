import { CarsRepositoryInMemory } from "@modules/cars/repositories/In-memory/CarsRepositoryInMemory";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let carsRepositoryInMemory: CarsRepositoryInMemory;
let listAvailableCarsUseCase: ListAvailableCarsUseCase;

describe("List Cars", () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory()
        listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepositoryInMemory);
    });

    it("should be able to list all available cars", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car name",
            description: "Car description",
            brand: "Car brand",
            category_id: "Category id",
            daily_rate: 140,
            fine_amount: 100,
            license_plate: "ABC-1234"
        });

        const cars = await listAvailableCarsUseCase.execute({
            brand: "Car brand",
        });

        expect(cars).toEqual([car]);
    });

    it("should be able to list all available cars by name", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car name 2",
            description: "Car description",
            brand: "Car brand",
            category_id: "Category id",
            daily_rate: 140,
            fine_amount: 100,
            license_plate: "ABC-1234"
        });

        const cars = await listAvailableCarsUseCase.execute({
            name: "Car name 2",
        });

        expect(cars).toEqual([car]);
    });

    it("should be able to list all available cars by brand", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car name 2",
            description: "Car description",
            brand: "Car brand",
            category_id: "Category id",
            daily_rate: 140,
            fine_amount: 100,
            license_plate: "ABC-1234"
        });

        const cars = await listAvailableCarsUseCase.execute({
            brand: "Car brand",
        });

        expect(cars).toEqual([car]);
    });

    it("should be able to list all available cars by category_id", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car name 3",
            description: "Car description",
            brand: "Car brand",
            category_id: "12345",
            daily_rate: 140,
            fine_amount: 100,
            license_plate: "ABC-1234"
        });

        const cars = await listAvailableCarsUseCase.execute({
            category_id: "12345",
        });

        expect(cars).toEqual([car]);
    });
});