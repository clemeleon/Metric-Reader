import { slug } from "../helpers/helper";

export type UserType = { from_id: string; from_name: string };

export class User {
    public readonly id: string;

    public readonly name: string;

    public count: number = 0;

    public readonly slug: string;

    constructor({ from_id, from_name }: UserType) {
        this.id = from_id;
        this.name = from_name;
        this.slug = slug(from_name);
    }

    public plus(): void {
        const count = this.count;
        this.count = count + 1;
    }

    public minus(): void {
        const count = this.count - 1;
        if (count > -1) {
            this.count = count;
        }
    }

    public clear(): void {
        this.count = 0;
    }
}
