import React, { Component, createContext } from "react";
import { Token } from "../datas/Token";
import { User } from "../datas/User";
import { Post } from "../datas/Post";

export interface Pair<V> {
    [key: string]: V;
}

export type StoreType = {
    admin?: Token;
    users: User[];
    posts: Post[];
    loading: boolean;
};

export type StoreItem = {
    dispatch: ({ state }: { state?: { [K in keyof StoreType]: any } }) => void;
} & StoreType;

const DefState = { admin: undefined, loading: true, posts: [], users: [] },
    Context = createContext<StoreItem>({
        ...DefState,
        dispatch: ({ state }: { state?: { [K in keyof StoreType]: any } }): void => {},
    }),
    { Provider } = Context;

export { Context as StoreContext, Provider as StoreProvider };

export class Store extends Component<{}, StoreType> {
    public constructor(props: {}) {
        super(props);
        this.state = DefState;
    }

    public componentDidMount() {}

    private dispatch = ({ state }: { state?: { [K in keyof StoreType]: any } }) => void {};

    public render(): JSX.Element {
        const { children } = this.props;
        return <Provider value={{ ...this.state, dispatch: this.dispatch }}>{children}</Provider>;
    }
}
