import { Component, FormEvent } from "react";
import { StoreContext } from "../components/Store";

interface LogState {
    name: string;
    email: string;
}
export class Login extends Component<{}, LogState> {
    public static contextType = StoreContext;
    private sign = (e: FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement,
            children = Array.from(form.children),
            data: string[] = [];
        for (const child of children) {
            if (child instanceof HTMLInputElement) {
                if (child.value.length >= 3) {
                    data.push(child.value);
                }
            }
        }
        if (data.length > 0) {
            const { login } = this.context;
            login(...data);
        }
    };
    render() {
        return (
            <main className={"container login center"}>
                <form onSubmit={(e) => this.sign(e)}>
                    <input name={"name"} type={"text"} placeholder={"Name"} />
                    <input name={"email"} type={"email"} placeholder={"Email"} />
                    <div className={"btn"}>
                        <button>Login</button>
                    </div>
                </form>
            </main>
        );
    }
}
