﻿// <copyright file="awards-table.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from "react";
import { Table, Text, Image } from "@fluentui/react-northstar";
import CheckboxBase from "./checkbox-base";
import { useTranslation } from 'react-i18next';
import "../styles/site.css";

interface IAwardsTableProps {
    showCheckbox: boolean,
    awardsData: any[],
    onCheckBoxChecked: (awardId: string, isChecked: boolean) => void,
}

const AwardsTable: React.FunctionComponent<IAwardsTableProps> = props => {
    const { t } = useTranslation();
    const awardsTableHeader = {
        key: "header",
        items: props.showCheckbox === true ?
            [
                { content: <div />, key: "check-box", className: "table-checkbox-cell" },
                { content: <div />, key: "image", className: "table-image-cell"  },
                {
                    content: <Text weight="regular" content={t('awardName')} />, key: "response"
                },
                { content: <Text weight="regular" content={t('awardDescription')} />, key: "questions" }
            ]
            :
            [
                { content: <Text weight="regular" content={t('awardName')} />, key: "response" },
                { content: <Text weight="regular" content={t('awardDescription')} />, key: "questions" }
            ],
    };

    let awardsTableRows = props.awardsData.map((value: any, index) => (
        {
            key: index,
            style: {},
            items: props.showCheckbox === true ?
                [
                    { content: <CheckboxBase onCheckboxChecked={props.onCheckBoxChecked} value={value.AwardId} />, key: index + "1", className: "table-checkbox-cell"},
                    { content: <Image avatar src={value.awardLink} />, key: index + "2", className: "table-image-cell" },
                    { content: <Text content={value.AwardName} title={value.AwardName} />, key: index + "3", truncateContent: true },
                    { content: <Text content={value.awardDescription} title={value.awardDescription} />, key: index + "4", truncateContent: true }
                ]
                :
                [
                    { content: <Text content={value.AwardName} title={value.AwardName} />, key: index + "2", truncateContent: true },
                    { content: <Text content={value.awardDescription} title={value.awardDescription} />, key: index + "3", truncateContent: true }
                ],
        }
    ));

    return (
        <div>
            <Table rows={awardsTableRows}
                header={awardsTableHeader} className="table-cell-content" />
        </div>
    );
}

export default AwardsTable;