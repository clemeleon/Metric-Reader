type TokenType = {
    client_id?: string;
    email: string;
    sl_token: string;
};

export class Token {
    private readonly id: string;

    private readonly email: string;

    public token: string;

    public date: Date;

    constructor({ client_id, email, sl_token }: TokenType) {
        this.id = client_id && client_id.length > 0 ? client_id : "ju16a6m81mhid5ue1z3v2g0uh";
        this.email = email;
        this.token = sl_token;
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

    public setToken(token: string): boolean {
        if (this.token !== token && token.length > 0) {
            this.token = token;
            this.date = new Date();
            return true;
        }
        return false;
    }

    public renew(): boolean {
        return this.date.getTime() - new Date().getTime() > 60 * 60 * 1000;
    }
}
