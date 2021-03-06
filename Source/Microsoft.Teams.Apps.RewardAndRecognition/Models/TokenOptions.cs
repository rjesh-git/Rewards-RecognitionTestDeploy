﻿// <copyright file="TokenOptions.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.RewardAndRecognition.Models
{
    /// <summary>
    /// Provides application setting related to JWT token.
    /// </summary>
    public class TokenOptions
    {
        /// <summary>
        /// Gets or sets random key to create JWT security key.
        /// </summary>
        public string SecurityKey { get; set; }
    }
}
