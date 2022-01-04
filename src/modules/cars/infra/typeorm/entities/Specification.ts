import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Car } from './Car';

@Entity("specifications")
class Specification {
    @PrimaryColumn()
    id?: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToMany(() => Car)
    @JoinTable({
        name: "specifications_cars",
        joinColumns: [{ name: "specification_id" }],
        inverseJoinColumns: [{ name: "car_id" }],
    })
    cars: Car[];


    @CreateDateColumn()
    created_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }
}

export { Specification };