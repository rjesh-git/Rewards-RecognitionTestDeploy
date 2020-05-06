﻿// <copyright file="INominateDetailSearchService.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.RewardAndRecognition.Providers
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.Teams.Apps.RewardAndRecognition.Models;

    /// <summary>
    /// Interface to provide Search nominations based on search query.
    /// </summary>
    public interface INominateDetailSearchService
    {
        /// <summary>
        /// Provide search result for nomination table.
        /// </summary>
        /// <param name="searchQuery">Search query to be provided by message extension.</param>
        /// <param name="teamId">Get the results based on the TeamId</param>
        /// <param name="count">Number of search results to return.</param>
        /// <param name="skip">Number of search results to skip.</param>
        /// <returns>List of search results.</returns>
        Task<IList<NominateEntity>> SearchNominationDetailsAsync(string searchQuery, string teamId, int? count = null, int? skip = null);
    }
}
