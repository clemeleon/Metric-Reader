import React, { Component, createContext } from "react";
import { Token, TokenType } from "../datas/Token";
import { User, UserType } from "../datas/User";
import { Post, PostType } from "../datas/Post";
import { Access } from "../helpers/Access";

export interface Pair<V> {
    [key: string]: V;
}

export type StoreState = {
    admin?: Token;
    users: User[];
    posts: Post[];
    loading: boolean;
    filters: {
        post: string;
        user: string;
        page: number;
    };
};

export type StoreUser = { name: string; email: string };

export type StorePost = { page: number; user?: User };

export type StoreItem = {
    load?: (page: number) => Promise<void>;
    login?: (name: string, email: string) => void;
    logout?: () => void;
    dispatch?: ({ state }: { state?: { [K in keyof StoreState]: any } }) => void;
} & StoreState;

const DefState: StoreState = {
        admin: undefined,
        loading: true,
        users: [],
        posts: [],
        filters: { post: "", user: "", page: 1 },
    },
    Context = createContext<StoreItem>(DefState),
    { Provider } = Context;

export { Context as StoreContext, Provider as StoreProvider };

export class Store extends Component<{}, StoreState> {
    private access: Access = new Access();

    private excludes: string[] = ["users", "posts", "admin"];

    private key: string = "admin";

    public constructor(props: {}) {
        super(props);
        this.state = DefState;
    }

    public componentDidMount() {
        let { admin, users } = this.state,
            loading = users.length > 0;
        try {
            const str = sessionStorage.getItem(this.key);
            if (str && str.length > 0) {
                const data = JSON.parse(str);
                if (data.hasOwnProperty("token") && data.token.length > 0) {
                    admin = new Token(data);
                }
            }
        } catch (e) {}
        this.setState({ admin, loading });
    }

    private renew = async (admin?: Token, skip: boolean = false): Promise<boolean> => {
        admin = admin ? admin : this.state.admin;
        if (admin) {
            if (admin.expired()) {
                console.log("in");
                const res = await this.access.post<{ data: TokenType }>(
                    "/register",
                    admin.getAll()
                );
                if (res.hasOwnProperty("data") && res.data.hasOwnProperty("sl_token")) {
                    if (admin.setToken(res.data)) {
                        sessionStorage.setItem(this.key, JSON.stringify(admin));
                        if (!skip) {
                            this.setState({ admin });
                        }
                    }
                }
            }
            if (admin.token.length > 0) {
                return true;
            }
        }
        return false;
    };

    private login = (name: string, email: string): void => {
        this.setState({ loading: true });
        this.renew(new Token({ id: "", token: "", name, email })).then(() => {
            this.setState({ loading: false });
        });
    };

    private logout = (): void => {
        sessionStorage.clear();
        this.setState({ admin: undefined });
    };

    private async fetchPosts(page: number = 1): Promise<void> {
        const { admin } = this.state;
        if (!(await this.renew(admin, true))) {
            return;
        }
        const res = await this.access.get<{ data: { posts: (PostType & UserType)[] } }>("/posts", {
            ...admin?.getToken(),
            page: page.toString(),
        });
        if (res && res.hasOwnProperty("data") && res.data.hasOwnProperty("posts")) {
            const { users, posts } = this.state,
                datas = res.data.posts;
            for (const data of datas) {
                let user = users.find((u) => u.id === data.from_id);
                if (!user) {
                    user = new User(data);
                    users.push(user);
                }
                user.plus();
                if (!posts.find((p) => p.id === data.id)) {
                    posts.push(new Post(data, page));
                }
            }
            this.setState({ users, posts, loading: false });
        }
    }

    private load = async (page: number = 1): Promise<void> => {
        this.setState({ loading: true });
        let posts = this.state.posts.filter((post) => post.page === page);
        if (posts.length < 100) {
            await this.fetchPosts(page);
        } else {
            this.setState({ loading: false });
        }
    };

    private dispatch = ({ state }: { state?: { [K in keyof StoreState]: any } }): void => {
        const states: { [K in keyof StoreState]?: any } = {};
        if (state) {
            const keys = Object.keys(state) as [keyof StoreState];
            for (const key of keys) {
                if (!this.state.hasOwnProperty(key)) {
                    throw new Error(`${key} does not exist in state`);
                } else if (this.excludes.includes(key)) {
                    throw new Error(`Can not set this ${key} from outside`);
                }
                states[key] = state[key];
            }
        }
        if (states && Object.keys(states).length > 0) {
            this.setState({ ...this.state, ...states });
        }
    };

    public render(): JSX.Element {
        const { children } = this.props;
        return (
            <Provider
                value={{
                    ...this.state,
                    login: this.login,
                    logout: this.logout,
                    load: this.load,
                    dispatch: this.dispatch,
                }}
            >
                {children}
            </Provider>
        );
    }
}
