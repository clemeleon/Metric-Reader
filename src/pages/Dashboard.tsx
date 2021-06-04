import React, { Component } from "react";
import { StoreContext, StoreItem, StoreState } from "../components/Store";
import { Token } from "../datas/Token";
import { User } from "../datas/User";
import { Post } from "../datas/Post";
import { Loading, PostItem, UserItem } from "../components/MixComponent";
import { PanelProps } from "../components/accordion/Panel";
import { Accordion, AccPanel } from "../components/accordion/Accordion";

interface DashState {}

type DashProp = {
    slug?: string;
};

export class Dashboard extends Component<DashProp, DashState> {
    private loaded: boolean = false;
    public static contextType = StoreContext;

    /*private async filter(page: number = 1): Promise<void> {
        this.setState({ more: true });
        let user: User | undefined = undefined,
            { load, users, posts } = this.context,
            { searchUser, searchPost } = this.state,
            { id = "" } = this.props;
        await load(page);
        if (id.length > 0) {
            user = users.find((u: User) => u.id === id);
        }
        const filterUsers = users.filter((u: User) => {
            return searchUser.length === 0 || u.name.includes(searchUser);
        });
        let filterPosts: Post[] = posts.filter((p: Post) => {
            return searchPost.length === 0 || p.message.includes(searchPost);
        });
        if (user) {
            filterPosts = filterPosts.filter((p) => {
                return user && p.owner === user.id;
            });
        }
        filterPosts = filterPosts.filter((p) => {
            return p.page <= page;
        });
        this.setState({ user, users: filterUsers, posts: filterPosts, more: false, page });
    }*/

    public componentDidMount(): void {
        const { load, posts }: StoreItem = this.context;
        if (posts.length === 0) {
            if (load) {
                console.log("jj");
                load(1).then();
            }
        }
    }

    private filter(): { users: User[]; posts: Post[]; mark: string } {
        const datas: { users: User[]; posts: Post[]; mark: string } = {
                users: [],
                posts: [],
                mark: "",
            },
            { loading, filters, posts, users }: StoreItem = this.context,
            { user, post, page } = filters,
            { slug = "" } = this.props;
        if (loading) {
            return datas;
        }
        if (slug.length > 0) {
            const uFind = users.find((u: User) => u.slug === slug);
            console.log(slug);
            if (uFind) {
                datas.mark = uFind.id;
            }
        }
        datas.users = users.filter((u: User) => {
            return user.length === 0 || u.name.includes(user);
        });
        datas.posts = posts.filter((p: Post) => {
            return post.length === 0 || p.message.includes(post);
        });
        if (datas.mark) {
            datas.posts = datas.posts.filter((p) => {
                return p.owner === datas.mark;
            });
        }
        datas.posts = datas.posts.filter((p) => {
            return p.page <= page;
        });
        return datas;
    }

    public render() {
        const { users, posts, mark } = this.filter(),
            more = users.length === 0 && posts.length === 0,
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
                {more ? (
                    <Loading center={more} mgs={"Loading more items!"} />
                ) : (
                    <div className={"list"}>
                        <div className={"users"}>
                            {users.map((u: User) => (
                                <UserItem id={mark} user={u} key={u.id} />
                            ))}
                        </div>
                        <div className={"posts"}>
                            {/*{posts.map((p: Post) => (*/}
                            {/*    <PostItem post={p} key={p.id} />*/}
                            {/*))}*/}
                            <Accordion multiple={false} panels={panels} />
                        </div>
                    </div>
                )}
            </main>
        );
    }
}
