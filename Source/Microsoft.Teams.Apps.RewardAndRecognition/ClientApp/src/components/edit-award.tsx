// <copyright file="edit-award.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from "react";
import { Flex, Text, Button, Input, TextArea } from "@fluentui/react-northstar";
import * as microsoftTeams from "@microsoft/teams-js";
import { createBrowserHistory } from "history";
import { postAward } from "../api/awards-api";
import { getApplicationInsightsInstance } from "../helpers/app-insights";
import { withTranslation, WithTranslation } from "react-i18next";
import { AwardDetails } from "../models/award";
import { isNullorWhiteSpace, checkUrl } from "../helpers/utility";

const browserHistory = createBrowserHistory({ basename: "" });

interface IEditAwardState {
    awardName: string;
    awardDescription: string;
    awardImageLink: string | undefined;
    createdBy: string,
    createdOn: Date | undefined,
    isNameValuePresent: boolean,
    isDescriptionValuePresent: boolean,
    error: string,
    isSubmitLoading: boolean
}

interface IAwardProps extends WithTranslation {
    award: any,
    teamId: string,
    onBackButtonClick: () => void,
    onSuccess: (operation: string) => void
}

/** Component to edit award details. */
class EditAward extends React.Component<IAwardProps, IEditAwardState> {
    telemetry?: any = null;
    locale?: string | null;
    theme?: string | null;
    userObjectId?: string = "";
    appInsights: any;

    constructor(props: any) {
        super(props);
        this.state = {
            awardName: props.award.AwardName,
            awardDescription: props.award.awardDescription,
            awardImageLink: props.award.awardLink,
            createdBy: props.award.createdBy,
            createdOn: props.award.createdOn,
            isNameValuePresent: true,
            isDescriptionValuePresent: true,
            error: "",
            isSubmitLoading: false
        }
        let search = window.location.search;
        let params = new URLSearchParams(search);
        this.telemetry = params.get("telemetry");
        this.theme = params.get("theme");
        this.locale = params.get("locale");
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
     * Handle update changes event.
     */
    onUpdateButtonClick = async (t: any) => {
        if (this.checkIfSubmitAllowed(t)) {
            this.setState({ isSubmitLoading: true });
            this.appInsights.trackEvent({ name: `Edit award` }, { User: this.userObjectId });
            let awardDetail: AwardDetails = {
                AwardId: this.props.award.AwardId,
                AwardName: this.state.awardName,
                AwardDescription: this.state.awardDescription,
                AwardLink: this.state.awardImageLink,
                TeamId: this.props.teamId,
                CreatedBy: this.state.createdBy,
                CreatedOn: this.state.createdOn
            };

            let response = await postAward(awardDetail);
            if (response.status === 200 && response.data) {
                this.props.onSuccess("edit");
            }
            else {
                this.setState({ error: response.statusText, isSubmitLoading: false })
            }
        }
    }

    /**
     * Validate input fields for update.
    */
    checkIfSubmitAllowed = (t: any) => {
        if (isNullorWhiteSpace(this.state.awardName)) {
            this.setState({ isNameValuePresent: false });
            return false;
        }

        if (isNullorWhiteSpace(this.state.awardDescription)) {
            this.setState({ isDescriptionValuePresent: false });
            return false;
        }
        if (!isNullorWhiteSpace(this.state.awardImageLink!)) {

            let result = checkUrl(this.state.awardImageLink!);
            if (!result) { this.setState({ error: t('invalidImageLink') }) }
            return result;
        }

        return true;
    }

    /**
     * Handle name change event.
     */
    handleInputNameChange = (event: any) => {
        this.setState({ awardName: event.target.value, isNameValuePresent: true });
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

    private getWrapperPage = () => {
        const { t } = this.props;
        return (
            <div >
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
                        <div className="add-form-input">
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
                                <Button content={t('saveButtonText')} primary
                                    loading={this.state.isSubmitLoading}
                                    disabled={this.state.isSubmitLoading}
                                    onClick={() => { this.onUpdateButtonClick(t) }}
                                />
                            </Flex>
                        </Flex>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(EditAward)