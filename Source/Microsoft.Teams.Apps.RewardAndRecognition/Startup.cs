// <copyright file="Startup.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.RewardAndRecognition
{
    using System;
    using Microsoft.ApplicationInsights;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
    using Microsoft.Bot.Builder;
    using Microsoft.Bot.Builder.BotFramework;
    using Microsoft.Bot.Builder.Integration.AspNet.Core;
    using Microsoft.Bot.Connector.Authentication;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Teams.Apps.RewardAndRecognition.Authentication;
    using Microsoft.Teams.Apps.RewardAndRecognition.BackgroundService;
    using Microsoft.Teams.Apps.RewardAndRecognition.Bot;

    /// <summary>
    /// The Startup class is responsible for configuring the DI container and acts as the composition root.
    /// </summary>
    public sealed class Startup
    {
        private readonly IConfiguration configuration;

        /// <summary>
        /// Initializes a new instance of the <see cref="Startup"/> class.
        /// </summary>
        /// <param name="configuration">The environment provided configuration.</param>
        public Startup(IConfiguration configuration)
        {
            this.configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Configure the composition root for the application.
        /// </summary>
        /// <param name="services">The stub composition root.</param>
        /// <remarks>
        /// For more information see: https://go.microsoft.com/fwlink/?LinkID=398940.
        /// </remarks>
#pragma warning disable CA1506 // Composition root expected to have coupling with many components.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddHttpContextAccessor();
            services.AddCredentialProviders(this.configuration);
            services.AddConfigurationSettings(this.configuration);
            services.AddProviders();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            // Register authentication services in DI container.
            services.AddRewardAndRecognitionAuthentication(this.configuration);

            services.AddSingleton<TelemetryClient>();

            // Create the Bot Framework Adapter with error handling enabled.
            services.AddSingleton<IBotFrameworkHttpAdapter, RewardAndRecognitionAdapterWithErrorHandler>();

            // Create the Bot Framework Adapter with error handling enabled.
            services
                .AddTransient<ICredentialProvider, ConfigurationCredentialProvider>();

            // Create the Translation Middleware that will be added to the middleware pipeline in the AdapterWithErrorHandler
            services.AddSingleton<RewardAndRecognitionActivityMiddleWare>();
            services
                .AddTransient<IBot, RewardAndRecognitionActivityHandler>();
            services
                .AddTransient(serviceProvider => (BotFrameworkAdapter)serviceProvider.GetRequiredService<IBotFrameworkHttpAdapter>());
            services
                .AddMvc()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            // Add i18n.
            services.AddLocalizationSettings(this.configuration);

            // Background service
            services.AddHostedService<RewardCycleBackgroundService>();
            services.AddSingleton<IRewardCycleHelper, RewardCycleHelper>();
        }
#pragma warning restore CA1506

        /// <summary>
        /// Configure the application request pipeline.
        /// </summary>
        /// <param name="app">The application.</param>
        /// <param name="environment">Hosting environment.</param>
        public void Configure(IApplicationBuilder app, IHostingEnvironment environment)
        {
            if (environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseAuthentication();
            app.UseRequestLocalization();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseMvc();
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (environment.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
