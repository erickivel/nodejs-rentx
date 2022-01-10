import { AppError } from "@shared/errors/AppError";
import { CategoriesRepositoryinMemory } from "@modules/cars/repositories/In-memory/CategoriesRepositoryinMemory";
import { CreateCategoryUseCase } from "./CreateCategoryUseCase";


let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryinMemory: CategoriesRepositoryinMemory

describe("Create Category", () => {
    beforeEach(() => {
        categoriesRepositoryinMemory = new CategoriesRepositoryinMemory();
        createCategoryUseCase = new CreateCategoryUseCase(categoriesRepositoryinMemory);
    });


    it("should be able to create a new category", async () => {
        const name = "Category Test";
        const description = "Category description";

        await createCategoryUseCase.execute({ name, description });

        const categoryCreated = await categoriesRepositoryinMemory.findByName(name);

        expect(categoryCreated).toHaveProperty("id");
    });

    it("should not be able to create a new category with same name", async () => {
        const name = "Category Test";
        const description = "Category description";

        await createCategoryUseCase.execute({ name, description });

        await expect(
            createCategoryUseCase.execute({ name, description }),
        ).rejects.toEqual(new AppError("Category already exists"));
    });
});
