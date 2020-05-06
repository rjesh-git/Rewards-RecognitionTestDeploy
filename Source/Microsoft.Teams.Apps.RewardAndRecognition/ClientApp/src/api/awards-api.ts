// <copyright file="awards-api.ts" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import axios from "./axios-decorator";

const baseAxiosUrl = window.location.origin;

/**
* Get all awards data from API
* @param {String} teamId Team Id for which the awards will be fetched
*/
export const getAllAwards = async (teamId: string): Promise<any> => {

	let url = baseAxiosUrl + `/api/Awards/GetAwards?teamId=${teamId}`;
    return await axios.get(url, undefined);
}

/**
* Get award data from API
* @param {String} teamId Team Id for which the awards will be fetched
*/
export const getAwardDetails = async (teamId: string | null, awardId: string | null): Promise<any> => {
    let url = baseAxiosUrl + `/api/Awards/GetAwardDetails?teamId=${teamId}&awardId=${awardId}`;
    return await axios.get(url, undefined);
}

/**
* Post award data from API
* @param {String} teamId Team Id for which the awards will be fetched
*/
export const postAward = async (data: any): Promise<any> => {

	let url = baseAxiosUrl + "/api/Awards/AddAward";
    return await axios.post(url, data, undefined);
}

/**
* Delete user selected award
* @param {Array<any>} data Selected award which needs to be deleted
*/
export const deleteAwards = async (data: any[]): Promise<any> => {

	let url = baseAxiosUrl + "/api/Awards/DeleteAwards";
    return await axios.post(url, data, undefined);
}