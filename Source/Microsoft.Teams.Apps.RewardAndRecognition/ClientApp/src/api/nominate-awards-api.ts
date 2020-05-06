/*
    <copyright file="nominate-awards-api.ts" company="Microsoft">
    Copyright (c) Microsoft. All rights reserved.
    </copyright>
*/

import axios from "./axios-decorator";
const baseAxiosUrl = window.location.origin;

/**
* Save nominated details.
* @param  {NominateEntity | Null} nominateDetails nominated details.
*/
export const saveNominateDetails = async (nominateDetails: any): Promise<any> => {

    let url = baseAxiosUrl + "/api/NominateDetail/savenominatedetailsasync";
    return await axios.post(url, nominateDetails, undefined);
}

/**
* Get nominated award details.
* @param  {String | Null} teamId Team id.
* @param  {String | Null} aadObjectId User azure active directory object id.
*/
export const getNominationAwardDetails = async (teamId: string | null, aadObjectId: string | null): Promise<any> => {
    let url = baseAxiosUrl + `/api/NominateDetail/getnominationdetailsasync?teamId=${teamId}&aadObjectId=${aadObjectId}`;
    return await axios.get(url, undefined);
}