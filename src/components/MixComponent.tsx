import { ComponentType, FC, ReactNode } from "react";
import { User } from "../datas/User";
import { Post } from "../datas/Post";
import { Link } from "react-router-dom";

const Loading: FC<{ mgs?: string; center?: boolean }> = ({
        mgs = "",
        center = false,
    }): JSX.Element => {
        return (
            <div className={center ? "loading-box center" : "loading-box"}>
                <div className={"loading show"}>
                    <div />
                    <div />
                    <div />
                    <div />
                </div>
                {mgs.length > 0 ? <p>{mgs}</p> : ""}
            </div>
        );
    },
    UserItem: FC<{ user: User; id: string }> = ({ user, id = "" }): JSX.Element => {
        return (
            <div className={id === user.id ? "user mark" : "user"}>
                <Link to={`/${user.slug}`}>
                    <div>{user.name}</div>
                    <div>{user.count}</div>
                </Link>
            </div>
        );
    },
    PostItem: FC<{ post: Post }> = ({ post }): JSX.Element => {
        return (
            <div className={"post"}>
                <div>{post.message}</div>
            </div>
        );
    };

export { Loading, UserItem, PostItem };
