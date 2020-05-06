// <copyright file="manage-award-tab.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from "react";
import { Menu } from "@fluentui/react-northstar";
import ManageAward from "./manage-awards";
import RewardCycle from "./reward-cycle";
import "../styles/site.css";
import { WithTranslation, withTranslation } from "react-i18next";

interface IState {
    selectedMenuItemIndex: number,
}

/** Component for displaying on manage award tab. */
class AwardsTab extends React.Component<WithTranslation, IState> {
    telemetry?: any = null;
    locale?: string | null;
    theme: string | null = null;
    teamId?: string | null;
    props: any;

    constructor(props) {
        super(props);
        this.state = {
            selectedMenuItemIndex: 0
        };

        let search = window.location.search;
        let params = new URLSearchParams(search);
        this.theme = params.get("theme");
        this.locale = params.get("locale");
        this.teamId = params.get("teamId");
        this.telemetry = params.get("telemetry");
    }

    getMenuItems = (t: any) => {
        return [
            {
                key: "manageawards",
                content: t('menuAwards'), 
            },
            {
                key: "rewardcycle",
                content: t('menuSetRewardCycle'), 
            }
        ];
    }

    /** 
   *  Called once menu item is clicked.
   * */
    onMenuItemClick = (event: any, data: any) => {
        this.setState({ selectedMenuItemIndex: data.index });
    }

    render() {
        const { t } = this.props;
        return (
            <div className="module-container">
                <Menu defaultActiveIndex={0} onItemClick={this.onMenuItemClick} items={this.getMenuItems(t)} styles={{ borderBottom: "0", marginBottom: "1rem", marginTop: "0.5rem" }} underlined primary />
                {this.state.selectedMenuItemIndex === 0 && <ManageAward teamId={this.teamId!}/>}
                {this.state.selectedMenuItemIndex === 1 && <RewardCycle teamId={this.teamId!} />}
            </div>
        );
    }
}

export default withTranslation()(AwardsTab);