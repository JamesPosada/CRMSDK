// =====================================================================
//
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
//<snippetMainPageXamlCS>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;

namespace SoapForSilverlightSample
{
    using SoapForSilverlightSample.CrmSdk;
    using System.Text;

    public partial class MainPage : UserControl
    {
        int MaxRecordsToReturn = 5;

        public MainPage(App app)
        {
            InitializeComponent();
            app.UnhandledException += new EventHandler<ApplicationUnhandledExceptionEventArgs>(app_UnhandledException);
        }

        private void ReportError(Exception ex)
        {
            this.ReportMessage("Exception: " + SilverlightUtility.ConvertToString(ex));
        }

        private void ReportMessage(string message)
        {
            this.Dispatcher.BeginInvoke(() => ResultsBox.Text = message);
        }

        private void app_UnhandledException(object sender, ApplicationUnhandledExceptionEventArgs e)
        {
            this.ReportError(e.ExceptionObject);
        }

        private void AccountList_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                QueryExpression query = new QueryExpression()
                {
                    EntityName = "account",
                    ColumnSet = new ColumnSet()
                    {
                        Columns = new System.Collections.ObjectModel.ObservableCollection<string>(new string[] { "name" })

                    },
                    Orders = new System.Collections.ObjectModel.ObservableCollection<OrderExpression>(new OrderExpression[]
				{
					new OrderExpression() { AttributeName = "name", OrderType = OrderType.Ascending }
				})
                };

                query.PageInfo = new PagingInfo { Count = MaxRecordsToReturn, PageNumber = 1, PagingCookie = null };

                OrganizationRequest request = new OrganizationRequest() { RequestName = "RetrieveMultiple" };
                request["Query"] = query;

                IOrganizationService service = SilverlightUtility.GetSoapService();

                service.BeginExecute(request, new AsyncCallback(AccountList_ClickCallback), service);
            }
            catch (Exception ex)
            {
                this.ReportError(ex);
            }
        }

        private void AccountList_ClickCallback(IAsyncResult result)
        {
            try
            {
                OrganizationResponse response = ((IOrganizationService)result.AsyncState).EndExecute(result);
                EntityCollection results = (EntityCollection)response["EntityCollection"];

                StringBuilder sb = new StringBuilder();
                if (results.Entities.Count == 0)
                { sb.AppendLine("There are no Account records in the system."); }

                foreach (Entity entity in results.Entities)
                {
                    sb.AppendLine("Account Name = " + entity.GetAttributeValue<string>("name"));
                }
                if (results.MoreRecords)
                {
                    sb.AppendLine("Only the first " + MaxRecordsToReturn + " records were returned.");
                }
                this.ReportMessage(sb.ToString());

            }
            catch (Exception ex)
            {
                this.ReportError(ex);
            }
        }

        private void EntityList_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                OrganizationRequest request = new OrganizationRequest() { RequestName = "RetrieveAllEntities" };
                request["EntityFilters"] = EntityFilters.Entity;
                request["RetrieveAsIfPublished"] = false;
                IOrganizationService service = SilverlightUtility.GetSoapService();
                service.BeginExecute(request, new AsyncCallback(EntityList_ClickCallback), service);
            }
            catch (Exception ex)
            { this.ReportError(ex); }


        }

        private void EntityList_ClickCallback(IAsyncResult result)
        {
            try
            {

                OrganizationResponse response = ((IOrganizationService)result.AsyncState).EndExecute(result);
                System.Collections.ObjectModel.ObservableCollection<EntityMetadata> entities = (System.Collections.ObjectModel.ObservableCollection<EntityMetadata>)response["EntityMetadata"];

                StringBuilder sb = new StringBuilder();
                foreach (EntityMetadata entity in entities)
                {
                    sb.AppendLine(entity.SchemaName);
                }
                this.ReportMessage(sb.ToString());


            }
            catch (Exception ex)
            {
                this.ReportError(ex);
            }


        }



    }
}
//</snippetMainPageXamlCS>