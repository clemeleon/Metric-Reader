type TokenType = {
    client_id: string;
    email: string;
    sl_token: string;
};

export class Token {
    private id: string;

    public readonly email: string;

    public token: string;

    public readonly name: string;

    public date: Date;

    constructor(name: string, email: string) {
        this.id = "ju16a6m81mhid5ue1z3v2g0uh";
        this.email = email;
        this.name = name;
        this.token = "";
        this.date = new Date();
    }

    getAll(): TokenType {
        return {
            client_id: this.id,
            email: this.email,
            sl_token: this.token,
        };
    }

    /**
     * Token for fetching list of posts
     */
    public getToken(): string {
        return `sl_token=${this.token}`;
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

    public renew(): boolean {
        return this.date.getTime() - new Date().getTime() > 60 * 60 * 1000;
    }
}
