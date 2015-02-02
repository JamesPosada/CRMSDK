// =====================================================================
//  This file is part of the Microsoft Dynamics CRM SDK code samples.
//
//  Copyright (C) Microsoft Corporation.  All rights reserved.
//
//  This source code is intended only as a supplement to Microsoft
//  Development Tools and/or on-line documentation.  See these other
//  materials for detailed information regarding Microsoft code samples.
//
//  THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY
//  KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
//  IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//  PARTICULAR PURPOSE.
//
// =====================================================================
using System;
using System.Collections.Generic;
using System.Web.UI;

using Microsoft.Win32;
using Microsoft.Crm.Sdk;
using Microsoft.Crm.Sdk.Metadata;
using Microsoft.Crm.SdkTypeProxy.Metadata;
using Microsoft.Crm.SdkTypeProxy;
using Microsoft.Crm.Sdk.Query;

namespace IsvApplication
{
    /// <summary>
    /// Demonstrates how to write a Microsoft Dynamics CRM 4.0 Web application that will be 
    /// compatible with a Microsoft Dynamics CRM 2011 IFD server. This Web application should
    /// be installed under the <crmwebroot>\ISV folder.
    /// </summary>
    /// <remarks>Related SDK topic: Upgrade Code in the ISV folder to Microsoft Dynamics CRM 2011 </remarks>
    public partial class DefaultPage : System.Web.UI.Page
    {
        private static string _crmServiceUrl;
        private static string _metadataServiceUrl;
        private static object _urlLock = new object();

        private string _organizationName;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                using (CrmImpersonator impersonator = new CrmImpersonator())
                {
                    // This is necessary because the URL, retrieved from the registry, will be the AD URL 
                    // (for example:  https://mybox/MSCRMServices/) while the certificates for this web site are
                    // setup for the IFD url (for example: https://org.crm.crmtoday.com).
                    System.Net.ServicePointManager.ServerCertificateValidationCallback = 
                        delegate(object s, System.Security.Cryptography.X509Certificates.X509Certificate certificate, 
                            System.Security.Cryptography.X509Certificates.X509Chain chain, System.Net.Security.SslPolicyErrors sslPolicyErrors)
                    {
                        return true;
                    };

                    // Generate the authentication token.
                    CrmAuthenticationToken token = CrmAuthenticationToken.ExtractCrmAuthenticationToken(this.Context, this.OrganizationName);
                    token.OrganizationName = this.OrganizationName;
                    token.AuthenticationType = 0;

                    using (CrmService service = new CrmService())
                    {
                        service.Credentials = System.Net.CredentialCache.DefaultCredentials;
                        service.CrmAuthenticationTokenValue = token;
                        service.Url = this.CrmServiceUrl;

                        WhoAmIResponse response = (WhoAmIResponse)service.Execute(new WhoAmIRequest());
                        systemuser user = (systemuser)service.Retrieve("systemuser", response.UserId, new ColumnSet(new string[] { "fullname" }));
                        CurrentUserName.Text = user.fullname;
                    }

                    // Create the MetadataService and retrieve the customizable entities.
                    using (MetadataService service = new MetadataService())
                    {
                        service.Credentials = System.Net.CredentialCache.DefaultCredentials;
                        service.CrmAuthenticationTokenValue = token;
                        service.Url = this.MetadataServiceUrl;

                        RetrieveAllEntitiesRequest request = new RetrieveAllEntitiesRequest();
                        request.MetadataItems = Microsoft.Crm.Sdk.Metadata.MetadataItems.EntitiesOnly;
                        request.RetrieveAsIfPublished = false;

                        RetrieveAllEntitiesResponse response = (RetrieveAllEntitiesResponse)service.Execute(request);

                        List<string> entityList = new List<string>();
                        foreach (EntityMetadata md in response.CrmMetadata)
                        {
                            string entityLabel;
                            LocLabel label = md.DisplayName.UserLocLabel;
                            if (null == label)
                            {
                                if (null != md.DisplayName.LocLabels && md.DisplayName.LocLabels.Length > 0)
                                {
                                    entityLabel = md.DisplayName.LocLabels[0].Label;
                                }
                                else
                                {
                                    entityLabel = md.SchemaName;
                                }
                            }
                            else
                            {
                                entityLabel = label.Label;
                            }

                            entityList.Add(entityLabel);
                        }

                        entityList.Sort();

                        foreach (string label in entityList)
                        {
                            cmbEntities.Items.Add(label);
                        }
                    }
                }
            }
        }

        #region Private Properties
        private string OrganizationName
        {
            get
            {
                if (string.IsNullOrEmpty(_organizationName))
                {
                    // NOTE: This parsing mechanism is very basic (it was taken from the SDK), but it will work for the
                    // default URL formats for AD authentication and IFD authentication
                    string organizationName = null;
                    if (Request.Url.Segments.Length >= 2 && Request.Url.Segments[2].TrimEnd('/').ToLowerInvariant() == "isv")
                    {
                        organizationName = Request.Url.Segments[1].TrimEnd('/').ToLowerInvariant();
                    }

                    //IFD URL
                    if (string.IsNullOrEmpty(organizationName))
                    {
                        string url = Request.Url.Host.ToLowerInvariant();
                        int endPosition = url.IndexOf('.');
                        if (-1 != endPosition)
                        {
                            organizationName = url.Substring(0, endPosition);
                        }
                    }

                    this._organizationName = organizationName;
                }

                return this._organizationName;
            }
        }

        private string MetadataServiceUrl
        {
            get
            {
                lock (_urlLock)
                {
                    if (string.IsNullOrEmpty(_metadataServiceUrl))
                    {
                        _metadataServiceUrl = this.ServerUrl + "/2007/metadataservice.asmx";
                    }
                }

                return _metadataServiceUrl;
            }
        }

        private string CrmServiceUrl
        {
            get
            {
                lock (_urlLock)
                {
                    if (string.IsNullOrEmpty(_crmServiceUrl))
                    {
                        _crmServiceUrl = this.ServerUrl + "/2007/crmservice.asmx";
                    }
                }

                return _crmServiceUrl;
            }
        }

        private string ServerUrl
        {
            get
            {
                String getServerUrl;
                using (RegistryKey crmServerKey = Registry.LocalMachine.OpenSubKey("SOFTWARE\\Microsoft\\MSCRM"))
                {
                    getServerUrl = crmServerKey.GetValue("ServerUrl", string.Empty).ToString();
                }
                return getServerUrl;
            }
        }
        #endregion
    }
}
