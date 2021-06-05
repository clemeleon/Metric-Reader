import { Pair } from "../components/Store";

export class Access {
    private readonly base: string;

    private options: Pair<object | string> = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
    };

    constructor() {
        this.base = "https://api.supermetrics.com/assignment";
    }

    public async get<R extends Object>(path: RequestInfo, params: Pair<string>): Promise<R> {
        const query = new URLSearchParams(params).toString(),
            url = `${this.base}${path}${query.length > 0 ? `?${query}` : ""}`,
            options = { ...this.options, method: "GET" };
        const res = await fetch(url, options);
        if (!res.ok) {
            return {} as R;
        }
        return (await res.json()) as R;
    }

    public async post<R extends Object>(path: RequestInfo, params: Pair<string>): Promise<R> {
        const url = `${this.base}${path}`,
            body = JSON.stringify(params),
            options = { ...this.options, method: "POST", body };
        const res = await fetch(url, options);
        if (!res.ok) {
            return {} as R;
        }
        return (await res.json()) as R;
    }
}
