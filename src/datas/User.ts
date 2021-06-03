import { Post } from "./Post";

export type UserType = { from_id: string; from_name: string };

export class User {
    public id: string;

    public name: string;

    public posts: Post[] = [];

    constructor({ from_id, from_name }: UserType) {
        this.id = from_id;
        this.name = from_name;
    }
}
