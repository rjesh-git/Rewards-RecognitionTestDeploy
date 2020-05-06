// <copyright file="MustBeValidUpnHandler.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.RewardAndRecognition.Authentication
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.Extensions.Configuration;

    /// <summary>
    /// This authorization handler is responsible for checking if the "must be valid UPN" requirement is met.
    /// Please see the following link for policy-based authorization in ASP.NET core.
    /// https://docs.microsoft.com/en-us/aspnet/core/security/authorization/policies?view=aspnetcore-3.1
    /// </summary>
    public class MustBeValidUpnHandler : AuthorizationHandler<MustBeValidUpnRequirement>
    {
        private readonly bool disableAuthentication;
        private readonly HashSet<string> validUpnSet;

        /// <summary>
        /// Initializes a new instance of the <see cref="MustBeValidUpnHandler"/> class.
        /// </summary>
        /// <param name="configuration">ASP.NET Core <see cref="IConfiguration"/> instance.</param>
        public MustBeValidUpnHandler(IConfiguration configuration)
        {
            this.disableAuthentication = configuration.GetValue<bool>("DisableAuthentication", false);
            var validUpns = configuration.GetValue<string>("ValidUpns", string.Empty);
            this.validUpnSet = validUpns
                ?.Split(new char[] { ';', ',' }, StringSplitOptions.RemoveEmptyEntries)
                ?.Select(p => p.Trim())
                ?.ToHashSet()
                ?? new HashSet<string>();
        }

        /// <summary>
        /// This method checks if the "must be valid UPN" authorization requirement is met.
        /// </summary>
        /// <param name="context">AuthorizationHandlerContext instance.</param>
        /// <param name="requirement">IAuthorizationRequirement instance.</param>
        /// <returns>A task that represents the work queued to execute.</returns>
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            MustBeValidUpnRequirement requirement)
        {
            context = context ?? throw new ArgumentNullException(nameof(context));

            if (this.disableAuthentication || this.IsValidUpn(context))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }

        /// <summary>
        /// Check whether a UPN is valid or not.
        /// This is where we should check against the valid list of UPNs
        /// </summary>
        /// <param name="context">Authorization handler context instance.</param>
        /// <returns>Indicate if a UPN is valid or not.</returns>
        private bool IsValidUpn(AuthorizationHandlerContext context)
        {
            var claim = context.User?.Claims?.FirstOrDefault(p => p.Type == ClaimTypes.Upn);
            var upn = claim?.Value;
            if (string.IsNullOrWhiteSpace(upn))
            {
                return false;
            }

            return this.validUpnSet.Contains(upn, StringComparer.OrdinalIgnoreCase);
        }
    }
}
