import React from "react";
import { Login } from "./pages/Login";
import { StoreContext, StoreItem } from "./components/Store";
import { Token } from "./datas/Token";
import { Dashboard } from "./pages/Dashboard";
import { Loading } from "./components/MixComponent";
import { BrowserRouter as Router, Switch, Route, match, Redirect } from "react-router-dom";

export type DashParams = { slug?: string };
export type RouteParams = { match: match<DashParams> };

class App extends React.Component {
    public static contextType = StoreContext;

    private verify({ match }: RouteParams, on: boolean): JSX.Element {
        const { params } = match,
            { slug = "" } = params;
        if (slug.length > 0 && on) {
            return <Dashboard slug={slug} />;
        }
        return <Redirect to={"/"} />;
    }

    private logout = (): void => {
        const { logout }: StoreItem = this.context;
        if (logout) {
            logout();
        }
    };

    render() {
        const { admin, loading } = this.context,
            on = admin instanceof Token;
        return (
            <div className="app">
                <header className="header">
                    {on ? <button onClick={() => this.logout()}>Logout</button> : ""}
                </header>
                {loading ? (
                    <Loading />
                ) : (
                    <Router>
                        <Switch>
                            <Route path={"/"} exact={true}>
                                {on ? <Dashboard /> : <Login />}
                            </Route>
                            <Route
                                path={"/:slug"}
                                exact={true}
                                render={(data: RouteParams) => this.verify(data, on)}
                            />
                        </Switch>
                    </Router>
                )}
            </div>
        );
    }
}

export default App;
