// <copyright file="publishawards-api" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import axios from "./axios-decorator";

const baseAxiosUrl = window.location.origin;

/**
* Get all nominations from API.
* @param {String} teamId Team Id for which the awards will be fetched.
 *@param {boolean} isAwardGranted flag: true for published award, else false.
 *@param {String} awardCycleId Active award cycle unique id.
*/
export const getAllAwardNominations = async (teamId: string | undefined, isAwardGranted: boolean | undefined, awardCycleId: string | undefined): Promise<any> => {

    let url = baseAxiosUrl + `/api/NominateDetail/getallnomination?teamId=${teamId}&isAwardGranted=${isAwardGranted}&awardCycleId=${awardCycleId}`;
    return await axios.get(url, undefined);
}

/**
* publish nominations from API
* @param {String} teamId Team Id for which the awards will be fetched.
 *@param {String} nominationIds Publish nomination ids.
*/
export const publishAwardNominations = async (teamId: string | undefined, nominationIds: string | undefined): Promise<any> => {

    let url = baseAxiosUrl + `/api/NominateDetail/publishnominations?teamId=${teamId}&nominationIds=${nominationIds}`;
    return await axios.get(url, undefined);
}