import React, { Component } from "react";
import { StoreContext, StoreItem } from "../components/Store";
import { User } from "../datas/User";
import { Post } from "../datas/Post";
import { PostItem, UserItem } from "../components/MixComponent";
import { Accordion, AccPanel } from "../components/accordion/Accordion";

interface DashState {}

type DashProp = {
    slug?: string;
};

interface Filter {
    users: User[];
    posts: Post[];
    mark: string;
    order: boolean;
    page: number;
}

export class Dashboard extends Component<DashProp, DashState> {
    private loaded: boolean = false;
    public static contextType = StoreContext;

    public componentDidMount(): void {
        const { posts }: StoreItem = this.context;
        if (posts.length === 0) {
            this.fetch(1);
        }
    }

    private fetch = (page: number, fetch: boolean = true): void => {
        const { load, dispatch }: StoreItem = this.context;
        if (load && dispatch) {
            if (fetch) {
                load(page).then();
            } else {
                dispatch({ page });
            }
        }
    };

    private sortByDate = (sort: boolean): void => {
        const { dispatch }: StoreItem = this.context;
        if (dispatch) {
            dispatch({ order: !sort });
        }
    };

    private filterUser = (target: EventTarget): void => {
        const { dispatch }: StoreItem = this.context;
        if (dispatch && target instanceof HTMLInputElement) {
            const val = target.value.trim();
            dispatch({ user: val });
        }
    };

    private filterPost = (target: EventTarget): void => {
        const { dispatch }: StoreItem = this.context;
        if (dispatch && target instanceof HTMLInputElement) {
            const val = target.value.trim();
            dispatch({ post: val });
        }
    };

    private filter(): Filter {
        const datas: Filter = {
                users: [],
                posts: [],
                mark: "",
                order: true,
                page: 1,
            },
            {
                loading,
                posts,
                users,
                user = "",
                post = "",
                page = 1,
                order = false,
            }: StoreItem = this.context,
            { slug = "" } = this.props;
        if (loading) {
            return datas;
        }
        if (slug.length > 0) {
            const uFind = users.find((u: User) => u.slug === slug);
            if (uFind) {
                datas.mark = uFind.id;
            }
        }
        datas.users = users.filter((u: User) => {
            u.clear();
            return user.length === 0 || u.name.toLowerCase().includes(user.toLowerCase());
        });

        if (datas.mark && datas.users.length > 0) {
            datas.posts = posts.filter((p: Post) => {
                return post.length === 0 || p.message.toLowerCase().includes(post.toLowerCase());
            });
            datas.posts = datas.posts.filter((p) => {
                return p.owner === datas.mark;
            });
            datas.posts = datas.posts.filter((p) => {
                return p.page === page;
            });
            datas.posts = order
                ? datas.posts.sort((a, b) => a.created.getTime() - b.created.getTime())
                : datas.posts.sort((a, b) => b.created.getTime() - a.created.getTime());
        }
        posts.forEach((p) => {
            const bol = p.page === page;
            if (bol) {
                for (const u of datas.users) {
                    if (u.id === p.owner) {
                        u.plus();
                        break;
                    }
                }
            }
            return bol;
        });
        datas.order = order;
        datas.page = page;
        datas.users.sort((a, b) => a.name.localeCompare(b.name));

        return datas;
    }

    public render() {
        const { users, posts, mark, order, page } = this.filter(),
            sort = order ? "ASC" : "DESC",
            panels: AccPanel[] = posts.map((p) => {
                return {
                    label: (
                        <div>
                            {p.created.toLocaleString(undefined, {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                second: "numeric",
                            })}
                        </div>
                    ),
                    content: <PostItem post={p} key={p.id} />,
                };
            });
        return (
            <main className={"container dash"}>
                <div className={"area"}>
                    <div className={"top"}>
                        <div>
                            <input
                                onKeyUp={(e) => this.filterUser(e.target)}
                                placeholder={"Search users"}
                            />
                        </div>
                        <div>
                            <button
                                disabled={posts.length === 0}
                                onClick={() => this.sortByDate(order)}
                            >
                                {sort}
                            </button>
                        </div>
                        <div>
                            <input
                                onKeyUp={(e) => this.filterPost(e.target)}
                                placeholder={"Search posts"}
                            />
                        </div>
                        <div className={"pagination"}>
                            <button
                                disabled={page <= 1}
                                onClick={() => this.fetch(page - 1, false)}
                            >
                                Previous
                            </button>
                            <span>{page}</span>
                            <button onClick={() => this.fetch(page + 1)}>Next</button>
                        </div>
                    </div>
                    <div className={"list"}>
                        <div className={"users"}>
                            {users.length === 0 ? (
                                <div className={"center"}>No users found!</div>
                            ) : (
                                users.map((u: User) => <UserItem id={mark} user={u} key={u.id} />)
                            )}
                        </div>
                        <div className={"posts"}>
                            {panels.length > 0 ? (
                                <Accordion multiple={false} panels={panels} />
                            ) : (
                                <div className={"center"}>
                                    Click on any user from the left panel!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}
