import React from "react";
import { Login } from "./pages/Login";
import { StoreContext } from "./components/Store";
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

    render() {
        const { admin, loading } = this.context,
            on = admin instanceof Token;
        return (
            <div className="app">
                <header className="header">
                    <div>cool</div>
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
                            {/*{on ? <Dashboard /> : <Redirect to={"/"} />}*/}
                        </Switch>
                    </Router>
                )}
            </div>
        );
    }
}

export default App;
