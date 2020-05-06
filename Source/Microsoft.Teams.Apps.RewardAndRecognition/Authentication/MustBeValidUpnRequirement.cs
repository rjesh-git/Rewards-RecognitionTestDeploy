// <copyright file="MustBeValidUpnRequirement.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.RewardAndRecognition.Authentication
{
    using Microsoft.AspNetCore.Authorization;

    /// <summary>
    /// This class is an authorization policy requirement.
    /// It specifies that an id token must contain valid UPN claim.
    /// </summary>
    public class MustBeValidUpnRequirement : IAuthorizationRequirement
    {
    }
}
