import { Category } from "@modules/cars/infra/typeorm/entities/Category";
import { ICategoriesRepository } from "../ICategoriesRepository";

class CategoriesRepositoryinMemory implements ICategoriesRepository {

    categories: Category[] = [];

    async findByName(name: string): Promise<Category> {
        const category = this.categories.find(category => category.name === name);

        return category;
    }

    async create({ name, description }): Promise<void> {
        const category = new Category();

        Object.assign(category, { name, description });

        this.categories.push(category);
    }


    async list(): Promise<Category[]> {
        const allCategories = this.categories;

        return allCategories;
    }
}

export { CategoriesRepositoryinMemory };