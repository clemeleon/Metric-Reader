import React, { Component, createContext } from "react";
import { Token } from "../datas/Token";
import { User, UserType } from "../datas/User";
import { Post, PostType } from "../datas/Post";
import { Access } from "../helpers/Access";

export interface Pair<V> {
    [key: string]: V;
}

export type StoreType = {
    admin?: Token;
    users: User[];
    loading: boolean;
};

export type StoreUser = { name: string; email: string };

export type StorePost = { page: number; user?: User };

export type StoreItem = {
    admin?: Token;
    loading: boolean;
    dispatch?: ({ state }: { state?: { [K in keyof StoreType]: any } }) => void;
    load?: (page: number) => Promise<User[]>;
    login?: (name: string, email: string) => void;
    logout?: () => void;
};

const DefState = { admin: undefined, loading: true, users: [] },
    Context = createContext<StoreItem>({
        loading: true,
        //dispatch: ({ state }: { state?: { [K in keyof StoreType]: any } }): void => {},
    }),
    { Provider } = Context;

export { Context as StoreContext, Provider as StoreProvider };

export class Store extends Component<{}, StoreType> {
    private access: Access = new Access();

    public constructor(props: {}) {
        super(props);
        this.state = DefState;
    }

    public componentDidMount() {
        let admin: Token | undefined = undefined,
            loading = false;
        try {
            const str = sessionStorage.getItem("admin");
            if (str && str.length > 0) {
                admin = new Token(JSON.parse(str));
            }
        } catch (e) {}
        this.setState({ admin, loading });
    }

    private dispatch = ({ state }: { state?: { [K in keyof StoreType]: any } }) => void {};

    public login = (name: string, email: string): void => {
        const token = new Token({});
        this.access.post("/register");
    };

    public logout = (): void => {};

    private async fetchPosts(page: number = 1): Promise<User[]> {
        const res = await this.access.get<{ data: { posts: (PostType & UserType)[] } }>("/posts", {
            page: page.toString(),
        });
        if (res && res.hasOwnProperty("data") && res.data.hasOwnProperty("posts")) {
            const users: User[] = this.state.users,
                posts = res.data.posts;
            for (const post of posts) {
                const user = users.find((u) => u.id === post.from_id) ?? new User(post, page);
                if (!user.posts.find((p) => p.id === post.id)) {
                    user.posts.push(new Post(post));
                }
            }
            this.setState({ users });
            return users;
        }
        return [];
    }

    private load = async (page: number = 1): Promise<User[]> => {
        let users = this.state.users.filter((user) => user.page === page);
        if (users.length === 0) {
            users = await this.fetchPosts(page);
        }
        return users;
    };

    public render(): JSX.Element {
        const { children } = this.props,
            { admin, loading } = this.state;
        return (
            <Provider
                value={{
                    admin,
                    loading,
                    login: this.login,
                    logout: this.logout,
                    load: this.load,
                    //dispatch: this.dispatch,
                }}
            >
                {children}
            </Provider>
        );
    }
}
