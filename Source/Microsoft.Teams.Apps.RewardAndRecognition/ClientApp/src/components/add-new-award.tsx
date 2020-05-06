// <copyright file="add-new-award.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from "react";
import { Text, Flex, Input, TextArea, Button } from "@fluentui/react-northstar";
import { createBrowserHistory } from "history";
import * as microsoftTeams from "@microsoft/teams-js";
import { getApplicationInsightsInstance } from "../helpers/app-insights";
import { postAward } from "../api/awards-api";
import { AwardDetails } from "../models/award";
import { withTranslation, WithTranslation } from "react-i18next";
import { isNullorWhiteSpace, checkUrl } from "../helpers/utility";

const browserHistory = createBrowserHistory({ basename: "" });

interface IAwardState {
    awardName: string;
    awardDescription: string;
    awardImageLink: string;
    isNameValuePresent: boolean,
    isDescriptionValuePresent: boolean,
    error: string,
    isSubmitLoading: boolean,
}

interface IAwardProps extends WithTranslation {
    awards: Array<any>,
    isNewAllowed: boolean,
    teamId: string,
    onBackButtonClick: () => void,
    onSuccess: (operation: string) => void
}

class AddAward extends React.Component<IAwardProps, IAwardState> {
    telemetry?: any = null;
    theme?: any = null;
    locale?: string | null;
    appInsights: any;
    userObjectId?: string = "";

    constructor(props: any) {
        super(props);

        this.state = {
            awardName: "",
            awardDescription: "",
            awardImageLink: "",
            isNameValuePresent: true,
            isDescriptionValuePresent: true,
            error: "",
            isSubmitLoading: false,
        }

        let search = window.location.search;
        let params = new URLSearchParams(search);
        this.telemetry = params.get("telemetry");
        this.theme = params.get("theme");
        this.locale = params.get("locale");
        this.appInsights = {};
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
        });
    }

    /**
   *Checks whether all validation conditions are matched before user submits new response
   */
    checkIfSubmitAllowed = (t: any) => {
        if (this.state.awardName === "") {
            this.setState({ isNameValuePresent: false });
        }

        if (this.state.awardDescription === "") {
            this.setState({ isDescriptionValuePresent: false });
        }

        let filteredData = this.props.awards.filter((award) => {
            return (award.AwardName.toUpperCase() === this.state.awardName.toUpperCase());
        });

        if (this.state.awardName && this.state.awardDescription) {
            if (filteredData.length > 0) {
                this.setState({ error: t('duplicateAwardError') })

                return false;
            }
            if (!isNullorWhiteSpace(this.state.awardImageLink)) {

                let result = checkUrl(this.state.awardImageLink);
                if (!result) { this.setState({ error: t('invalidImageLink') }) }

                return result;
            }

            return true;
        }
        else {
            return false;
        }
    }

    /**
     * Handle add award event.
     */
    onAddButtonClick = async (t: any) => {
        if (this.checkIfSubmitAllowed(t)) {
            this.setState({ isSubmitLoading: true });
            let awardDetail: AwardDetails = {
                AwardId: undefined,
                AwardName: this.state.awardName,
                AwardDescription: this.state.awardDescription,
                AwardLink: this.state.awardImageLink,
                TeamId: this.props.teamId,
                CreatedBy: undefined,
                CreatedOn: undefined
            };
            let response = await postAward(awardDetail);

            if (response.status === 200 && response.data) {
                this.setState({ error: '', isSubmitLoading: false });
                this.props.onSuccess("add");
                return;
            }
            else {
                this.setState({ error: response.statusText, isSubmitLoading: false })
            }
        }
    }

    /**
     * Handle name change event.
     */
    handleInputNameChange = (event: any) => {
        this.setState({ awardName: event.target.value, isNameValuePresent: true, error: "" });
    }

    /**
     * Handle description change event.
     */
    handleInputDescriptionChange = (event: any) => {
        this.setState({ awardDescription: event.target.value, isDescriptionValuePresent: true });
    }

    /**
     * Handle award link change event.
     */
    handleInputImageChange = (event: any) => {
        this.setState({ awardImageLink: event.target.value });
    }

    /**
    *Returns text component containing error message for failed name field validation
    *@param {boolean} isValuePresent Indicates whether value is present
    */
    private getRequiredFieldError = (isValuePresent: boolean, t: any) => {
        if (!isValuePresent) {
            return (<Text content={t('fieldRequiredMessage')} className="field-error-message" error size="medium" />);
        }

        return (<></>);
    }

    render() {
        const { t } = this.props;

        return (
            <>
                <div className="tab-container">
                    <div>
                        <Flex hAlign="center">
                            <Text content={this.state.error} className="field-error-message" error size="medium" />
                        </Flex>
                        <Flex gap="gap.small">
                            <Text content={t('awardName')} size="medium" />
                            <Flex.Item push>
                                {this.getRequiredFieldError(this.state.isNameValuePresent, t)}
                            </Flex.Item>
                        </Flex>
                        <div className="add-form-input">
                            <Input placeholder={t('awardNamePlaceholder')}
                                fluid required maxLength={100}
                                value={this.state.awardName}
                                onChange={this.handleInputNameChange}
                            />
                        </div>
                    </div>
                    <div>
                        <Flex gap="gap.small">
                            <Text content={t('awardDescription')} size="medium" />
                            <Flex.Item push>
                                {this.getRequiredFieldError(this.state.isDescriptionValuePresent, t)}
                            </Flex.Item>
                        </Flex>
                        <div className="add-form-input">
                            <TextArea placeholder={t('awardDescriptionPlaceholder')}
                                fluid required maxLength={300}
                                className="response-text-area"
                                value={this.state.awardDescription}
                                onChange={this.handleInputDescriptionChange}
                            />
                        </div>
                    </div>
                    <div>
                        <Flex gap="gap.small">
                            <Text content={t('awardLink')} size="medium" />
                        </Flex>
                        <div>
                            <Input placeholder={t('awardLinkPlaceholder')} fluid required
                                value={this.state.awardImageLink}
                                onChange={this.handleInputImageChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="tab-footer">
                    <div>
                        <Flex space="between">
                            <Button icon="icon-chevron-start"
                                content={t('backButtonText')} text
                                onClick={this.props.onBackButtonClick} />
                            <Flex gap="gap.small">
                                <Button content={t('addButtonText')} primary
                                    loading={this.state.isSubmitLoading}
                                    disabled={this.state.isSubmitLoading || !this.props.isNewAllowed}
                                    onClick={() => { this.onAddButtonClick(t) }}
                                />
                            </Flex>
                        </Flex>
                    </div>
                </div>
            </>
        );
    }
}

export default withTranslation()(AddAward)