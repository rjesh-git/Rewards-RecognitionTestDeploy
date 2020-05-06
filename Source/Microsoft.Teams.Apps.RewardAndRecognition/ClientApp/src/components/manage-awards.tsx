// <copyright file="manage-awards.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from "react";
import { Loader, Flex, Text, Image, Layout } from "@fluentui/react-northstar";
import { SeverityLevel } from "@microsoft/applicationinsights-web";
import { getApplicationInsightsInstance } from "../helpers/app-insights";
import * as microsoftTeams from "@microsoft/teams-js";
import { createBrowserHistory } from "history";
import CommandBar from "./manage-awards-command-bar";
import AwardsTable from "./awards-table";
import { getAllAwards, deleteAwards } from "../api/awards-api";
import AddAward from '../components/add-new-award';
import EditAward from '../components/edit-award';
import { WithTranslation, withTranslation } from "react-i18next";

const browserHistory = createBrowserHistory({ basename: "" });

interface IAwardData {
    teamId: string,
    AwardId: string,
    AwardName: string,
    awardDescription: string,
    awardLink: string,
    createdBy: string,
    createdOn: string;
    timestamp: string;
}

interface IAwardsState {
    loader: boolean;
    awards: IAwardData[];
    selectedAwards: string[];
    filteredAwards: IAwardData[];
    showAddAwards: boolean;
    showEditAwards: boolean;
    editAward: IAwardData | undefined;
    message: string | undefined;
}

interface IProps extends WithTranslation {
    teamId: string | undefined
}

/** Component for displaying on award details. */
class ManageAwards extends React.Component<IProps, IAwardsState> {
    telemetry?: any = null;
    theme?: string | null;
    teamId?: string | null;
    locale?: string | null;
    userObjectId?: string = "";
    appInsights: any;
    bearer: string = "";
    appUrl: string = (new URL(window.location.href)).origin;
    translate: any;

    constructor(props: any) {
        super(props);
        let search = window.location.search;
        let params = new URLSearchParams(search);
        this.telemetry = params.get("telemetry");
        this.theme = params.get("theme");
        this.locale = params.get("locale");
        this.teamId = params.get("teamId");

        this.state = {
            loader: true,
            filteredAwards: [],
            awards: [],
            selectedAwards: [],
            showAddAwards: false,
            showEditAwards: false,
            editAward: undefined,
            message: undefined
        }
    }

    /**
    * Used to initialize Microsoft Teams sdk
    */
    async componentDidMount() {
        microsoftTeams.initialize();
        microsoftTeams.getContext((context) => {
            this.userObjectId = context.userObjectId;

            // Initialize application insights for logging events and errors.
            this.appInsights = getApplicationInsightsInstance(this.telemetry, browserHistory);
            this.getAwards();
        });
    }

    /**
    *Get awards from API
    */
    async getAwards() {
        this.appInsights.trackTrace({ message: `'getAwards' - Initiated request`, properties: { User: this.userObjectId }, severityLevel: SeverityLevel.Information });
        let award = await getAllAwards(this.props.teamId!);

        if (award.status === 200 && award.data) {
            this.appInsights.trackTrace({ message: `'getAwards' - Request success`, properties: { User: this.userObjectId }, severityLevel: SeverityLevel.Information });
            this.setState({
                awards: award.data,
                filteredAwards: award.data
            });
        }
        else {
            this.appInsights.trackTrace({ message: `'getAwards' - Request failed`, properties: { User: this.userObjectId }, severityLevel: SeverityLevel.Information });
        }
        this.setState({
            loader: false
        });
    }

    /**
     * Handle back button click.
     */
    onBackButtonClick = () => {
        this.setState({ showAddAwards: false, showEditAwards: false, selectedAwards: [] });
        this.getAwards();
    }

    /**
    *Filters table as per search text entered by user
    *@param {String} searchText Search text entered by user
    */
    handleSearch = (searchText: string) => {
        if (searchText) {
            var filteredData = this.state.awards.filter(function (award) {
                return award.AwardName.toUpperCase().includes(searchText.toUpperCase()) ||
                    award.awardDescription.toUpperCase().includes(searchText.toUpperCase());
            });
            this.setState({ filteredAwards: filteredData });
        }
        else {
            this.setState({ filteredAwards: this.state.awards });
        }
    }

    /**
     * Handle award selection change.
     */
    onAwardsSelected = (awardId: string, isSelected: boolean) => {
        if (isSelected) {
            let selectAwards = this.state.selectedAwards;
            selectAwards.push(awardId);
            this.setState({
                selectedAwards: selectAwards
            })
        }
        else {
            let filterAwards = this.state.selectedAwards.filter((Id) => {
                return Id !== awardId;
            });

            this.setState({
                selectedAwards: filterAwards
            })
        }
    }

    /**
    *Navigate to add new award page
    */
    handleAddButtonClick = () => {
        this.appInsights.trackEvent({ name: `Add award` }, { User: this.userObjectId });
        this.setState({ showAddAwards: true });
    }

    /**
    *Navigate to edit award page
    */
    handleEditButtonClick = () => {
        this.appInsights.trackEvent({ name: `Edit award` }, { User: this.userObjectId });
        let editAward = this.state.awards.find(award => award.AwardId === this.state.selectedAwards[0])
        this.setState({ showEditAwards: true, editAward: editAward });
    }

    /**
    *Deletes selected awards
    */
    handleDeleteButtonClick = async () => {
        this.appInsights.trackEvent({ name: `Delete award` }, { User: this.userObjectId });
        this.appInsights.trackTrace({ message: `Delete award - Initiated request`, properties: { User: this.userObjectId }, severityLevel: SeverityLevel.Information });
        let deletionResult = await deleteAwards(this.state.selectedAwards);

        if (deletionResult.status === 200 && deletionResult.data) {
            this.appInsights.trackTrace({ message: `'Delete award' - Request success`, properties: { User: this.userObjectId }, severityLevel: SeverityLevel.Information });
            let awards = this.state.awards.filter((award) => {
                return !this.state.selectedAwards.includes(award.AwardId);
            });

            this.setState({
                awards: awards,
                filteredAwards: awards,
                selectedAwards: []
            })
            this.onSuccess("delete");
        }
        else {
            this.appInsights.trackTrace({ message: `'Delete award' - Request failed`, properties: { User: this.userObjectId }, severityLevel: SeverityLevel.Information });
        }
    }

    onSuccess = (operation: string) => {
        if (operation === "add") {
            this.setState({ message: this.translate('successAddAward'), showAddAwards: false, showEditAwards: false, selectedAwards: [] });
        }
        else if (operation === "delete") {
            this.setState({ message: this.translate('successDeleteAward'), showAddAwards: false, showEditAwards: false, selectedAwards: [] });
        }
        else if (operation === "edit") {
            this.setState({ message: this.translate('successEditAward'), showAddAwards: false, showEditAwards: false, selectedAwards: [] });
        }
        this.getAwards();
    }

    /**
    * Renders the component
    */
    public render(): JSX.Element {
        return (
            <div>
                {this.getWrapperPage()}
            </div>
        );
    }

    /**
    *Get wrapper for page which acts as container for all child components
    */
    private getWrapperPage = () => {
        const { t } = this.props;
        this.translate = t;
        if (this.state.loader) {
            return (
                <div className="tab-container">
                    <Loader />
                </div>
            );
        } else {

            return (
                <div>
                    {(this.state.showAddAwards === false && this.state.showEditAwards == false) &&
                        <div className="tab-container">
                            <CommandBar
                                isDeleteEnable={this.state.selectedAwards.length > 0}
                                isEditEnable={this.state.selectedAwards.length > 0 && this.state.selectedAwards.length < 2}
                                onAddButtonClick={this.handleAddButtonClick}
                                onDeleteButtonClick={this.handleDeleteButtonClick}
                                onEditButtonClick={this.handleEditButtonClick}
                                handleTableFilter={this.handleSearch}
                            />
                            <div>
                                <AwardsTable showCheckbox={true}
                                    awardsData={this.state.filteredAwards}
                                    onCheckBoxChecked={this.onAwardsSelected}
                                />
                            </div>
                            {this.state.awards.length === 0 &&
                                <Flex gap="gap.small" >
                                    <Flex.Item align="center">
                                        <Layout
                                            styles={{
                                                maxWidth: '50px',
                                            }}
                                            renderMainArea={() => <Image fluid src={this.appUrl + "/content/InformationIcon.png"} />}
                                        />
                                    </Flex.Item>
                                    <Flex.Item >
                                        <Flex column>
                                            <Text content={t('noAwardFoundText1')} />
                                            <Text content={t('noAwardFoundText2')} />
                                        </Flex>
                                    </Flex.Item>
                                </Flex>}
                        </div>}
                    {this.state.showAddAwards && <div>
                        <AddAward
                            isNewAllowed={!(this.state.awards.length >= 10)}
                            awards={this.state.awards}
                            onBackButtonClick={this.onBackButtonClick}
                            teamId={this.props.teamId!}
                            onSuccess={this.onSuccess}
                        />
                    </div>}
                    {this.state.showEditAwards && <div>
                        <EditAward
                            award={this.state.editAward}
                            onBackButtonClick={this.onBackButtonClick}
                            teamId={this.props.teamId!}
                            onSuccess={this.onSuccess}
                        />
                    </div>}
                    {(this.state.showAddAwards === false && this.state.showEditAwards == false) && <Flex>
                        <Text content={this.state.message} success />
                        {this.state.awards.length > 0 && <Flex.Item push>
                            <Text align="end" content={t('lastUpdatedOn', { time: new Date(this.state.awards[0].timestamp) })} />
                        </Flex.Item>}
                    </Flex>}
                </div>
            );
        }
    }
}

export default withTranslation()(ManageAwards);
