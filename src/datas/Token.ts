export type TokenType = {
    client_id: string;
    email: string;
    sl_token: string;
};

export type TokenData = {
    date?: string;
    email: string;
    id: string;
    name: string;
    token: string;
};

export class Token {
    private id: string;

    public readonly email: string;

    public token: string;

    public readonly name: string;

    public date: Date;

    constructor({ name, email, id = "", date, token = "" }: TokenData) {
        this.id = id.length > 0 ? id : "ju16a6m81mhid5ue1z3v2g0uh";
        this.email = email;
        this.name = name;
        this.token = token;
        if (date) {
            this.date = new Date(date);
        } else {
            const d = new Date();
            d.setHours(d.getHours() - 2);
            this.date = d;
        }
    }

    getAll(): { client_id: string; email: string; name: string } {
        return {
            client_id: this.id,
            email: this.email,
            name: this.name,
        };
    }

    /**
     * Token for fetching list of posts
     */
    public getToken(): { sl_token: string } {
        return { sl_token: this.token };
    }

    public setToken({ client_id, sl_token, email }: TokenType): boolean {
        if (this.token !== sl_token && sl_token.length > 0 && email === this.email) {
            this.token = sl_token;
            this.date = new Date();
            this.id = client_id;
            return true;
        }
        return false;
    }

    public expired(): boolean {
        const hour = 60 * 60 * 1000,
            old = this.date.getTime(),
            now = new Date().getTime();
        return now - old > hour;
    }
}
