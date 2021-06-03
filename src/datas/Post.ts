export type PostType = {
    id: string;
    message: string;
    type: string;
    created_time: string;
};

export class Post {
    public id: string;

    public message: string;

    public type: string;

    public created: Date;

    constructor({ id, message, type, created_time }: PostType) {
        this.id = id;
        this.message = message;
        this.type = type;
        this.created = new Date(created_time);
    }
}
