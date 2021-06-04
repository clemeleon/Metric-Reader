export type PostType = {
    id: string;
    message: string;
    type: string;
    created_time: string;
    from_id: string;
};

export class Post {
    public id: string;

    public message: string;

    public type: string;

    public created: Date;

    public owner: string;

    public readonly page: number;

    constructor({ id, message, type, created_time, from_id }: PostType, page: number) {
        this.id = id;
        this.message = message;
        this.type = type;
        this.created = new Date(created_time);
        this.page = page;
        this.owner = from_id;
    }
}
