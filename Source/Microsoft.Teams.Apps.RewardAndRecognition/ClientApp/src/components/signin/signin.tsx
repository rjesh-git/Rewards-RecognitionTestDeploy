import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Button } from "@fluentui/react-northstar";
import * as microsoftTeams from "@microsoft/teams-js";

const SignInPage: React.FunctionComponent<RouteComponentProps> = props => {
    
    function onSignIn() {
        microsoftTeams.initialize();
        microsoftTeams.authentication.authenticate({
            url: window.location.origin + "/signin-simple-start",
            successCallback: () => {
                console.log("Login succeeded!");
                window.location.href = "/discover";
            },
            failureCallback: (reason) => {
                console.log("Login failed: " + reason);
                window.location.href = "/errorpage";
            }
        });
    }

    return (
        <div className="sign-in-content-container">
            <Button content="Sign in" primary className="sign-in-button" onClick={onSignIn} />
        </div>
    );
};

export default SignInPage;