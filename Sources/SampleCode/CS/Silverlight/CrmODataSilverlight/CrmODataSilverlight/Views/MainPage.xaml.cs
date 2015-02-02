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
// =====================================================================
//<snippetMainPageCS>
using System;
using System.Collections.ObjectModel;
using System.Data.Services.Client;
using System.Linq;
using System.Threading;
using System.Windows.Controls;
using Microsoft.Crm.Sdk.Samples.CrmODataService;
using System.Net;
using System.Net.Browser;

namespace Microsoft.Crm.Sdk.Samples
{
    public partial class MainPage : UserControl
    {
        private SynchronizationContext _syncContext;
        private AdventureWorksCycleContext _context;
        private String _serverUrl;

        public MainPage()
        {
            InitializeComponent();

            //Keeps a reference to the UI thread
            _syncContext = SynchronizationContext.Current;

            //Get the ServerUrl (ServerUrl is formatted differently OnPremise than OnLine)
            _serverUrl = ServerUtility.GetServerUrl(); 

            if (!String.IsNullOrEmpty(_serverUrl))
            {
                
                //Setup Context
                _context = new AdventureWorksCycleContext(
                    new Uri(String.Format("{0}/xrmservices/2011/organizationdata.svc/", 
                        _serverUrl), UriKind.Absolute));

                //This is important because if the entity has new 
                //attributes added the code will fail.
                _context.IgnoreMissingProperties = true;

                MessagePanel.Children.Add(new TextBlock() {
                    Text = "Starting Create, Retrieve, Update, and Delete Operations."});

                //Begin the Create, Retrieve, Update, and Delete operations. The operations are chained together
                //as each of them is completed.
                BeginCreateAccount();
            }
            else
            {
                //No ServerUrl was found. Display message.
                MessagePanel.Children.Add(new TextBlock()
                {
                    Text =
                        "Unable to access server url. Launch this Silverlight " + 
                        "Web Resource from a CRM Form OR host it in a valid " + 
                        "HTML Web Resource with a " + 
                        "<script src='../ClientGlobalContext.js.aspx' " + 
                        "type='text/javascript'></script>" 
                });
            }
        }

        /// <summary>
        /// Creates an Account record in CRM.
        /// </summary>
        private void BeginCreateAccount()
        {
            Account newAccount = new Account();
            newAccount.Name = "New Account Created in Silverlight";
            _context.AddToAccountSet(newAccount);
            _context.BeginSaveChanges(OnCreateAccountComplete, newAccount);
        }

        /// <summary>
        /// Callback method invoked when Account is done being created.
        /// </summary>
        /// <param name="result"></param>
        private void OnCreateAccountComplete(IAsyncResult result)
        {
            try
            {                
                _context.EndSaveChanges(result);
                Account createdAccount = result.AsyncState as Account;
                MessagePanel.Children.Add(new TextBlock() { 
                    Text = String.Format("Created a new account named \"{0}\"\n\twith AccountId = \"{1}\".",
                        createdAccount.Name, createdAccount.AccountId) 
                });
                
                //Retrieve the Account just created.
                BeginRetrieveAccount(createdAccount.AccountId);
            }
            catch (SystemException se)
            {
                _syncContext.Send(new SendOrPostCallback(showErrorDetails), se);
            }
        }

        /// <summary>
        /// Creates a DataServiceQuery to retrieve the Account created in this sample.
        /// </summary>
        /// <param name="Id"></param>
        private void BeginRetrieveAccount(Guid Id)
        {
            try
            {
                DataServiceQuery<Account> query = (DataServiceQuery<Account>)_context
                    .AccountSet.Where<Account>(a => a.AccountId == Id);

                query.BeginExecute(OnRetrieveAccountComplete, query);
            }
            catch (DataServiceQueryException dsqe)
            {
                _syncContext.Send(new SendOrPostCallback(showErrorDetails), dsqe);
            }
        }

        /// <summary>
        /// Extracts the retrieve Account from the query result and Updates the account
        /// </summary>
        /// <param name="result"></param>
        private void OnRetrieveAccountComplete(IAsyncResult result)
        {
            try
            {
                DataServiceQuery<Account> results = 
                    result.AsyncState as DataServiceQuery<Account>;

                Account retrievedAccount = new DataServiceCollection<Account>(results
                    .EndExecute(result)).First<Account>();

                MessagePanel.Children.Add(new TextBlock() { Text = 
                    String.Format("Retrieved the account named \"{0}\".",
                        retrievedAccount.Name) });

                //Update the retrieved Account
                BeginUpdateAccount(retrievedAccount.AccountId);
            }
            catch (SystemException se)
            {
                _syncContext.Send(new SendOrPostCallback(showErrorDetails), se);
            }
        }

        /// <summary>
        /// Changes the Account name and saves changes
        /// </summary>
        /// <param name="Id"></param>
        private void BeginUpdateAccount(Guid Id)
        {
            try
            {
                Account updatedAccount = new Account();
                updatedAccount.Name = "Account updated in Silverlight";
                updatedAccount.AccountId = Id;
                _context.AttachTo("AccountSet", updatedAccount);
                _context.UpdateObject(updatedAccount);
                _context.BeginSaveChanges(OnUpdateAccountComplete, updatedAccount);
            }
            catch (SystemException se)
            { 
                _syncContext.Send(new SendOrPostCallback(showErrorDetails), se); 
            }
        }

        /// <summary>
        /// Callback method invoked after the Update has occurred. Will prompt user 
        /// to delete the Account.
        /// </summary>
        /// <param name="result"></param>
        private void OnUpdateAccountComplete(IAsyncResult result)
        {
            try
            {
                _context.EndSaveChanges(result);
                Account updatedAccount = result.AsyncState as Account;
                MessagePanel.Children.Add(new TextBlock() { Text = 
                    String.Format("The account was updated and renamed \"{0}\".",
                        updatedAccount.Name) });

                DeleteConfirmation confirm = new DeleteConfirmation(updatedAccount);
                confirm.Closed += new EventHandler(OnDeleteConfirmationClosed) ;
                confirm.Show();
            }
            catch (SystemException se)
            { 
                _syncContext.Send(new SendOrPostCallback(showErrorDetails), se); 
            }
        }

        /// <summary>
        /// Handles the DeleteConfirmation.Closed event. If result is true, invokes 
        /// the delete method.
        /// If user chooses no, they are presented the option to open the 
        /// native Account form.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OnDeleteConfirmationClosed(object sender, EventArgs e)
        {
            //Present a confirmation asking to delete the Account or keep it.
            DeleteConfirmation dlg = (DeleteConfirmation)sender;
            bool? result = dlg.DialogResult;

            //If user chooses Delete, begin deleting the record.
            if (result.HasValue && result.Value)
            {
                BeginDeleteAccount(dlg.accountForDeletion);
            }

            //If user chooses to save, present a Hyperlink to open the native record.
            else
            {
                MessagePanel.Children.Add(new TextBlock() { 
                    Text = "You chose not to delete this account. You can open this\n\t" + 
                    "account record by clicking this button:" });

                MessagePanel.Children.Add(new HyperlinkButton()
                {
                    Content = dlg.accountForDeletion.Name,
                    TargetName = "_blank",
                    Width =  200,
                    VerticalAlignment = System.Windows.VerticalAlignment.Center,
                    HorizontalAlignment= System.Windows.HorizontalAlignment.Left,
                    
                    //Create a link to open account type.
                    NavigateUri = new Uri(_serverUrl + 
                        String.Format("/main.aspx?etc=1&id={0}&pagetype=entityrecord", 
                            dlg.accountForDeletion.AccountId))
                });

                //Retrieve multiple Accounts
                BeginRetrieveAccounts();
            }
        }
  
        /// <summary>
        /// Marks the account state ready for Delete and
        /// </summary>
        /// <param name="accountToDelete"></param>
        private void BeginDeleteAccount(Account accountToDelete)
        {
            try
            { 
                _context.DeleteObject(accountToDelete);
                _context.BeginSaveChanges(OnDeleteAccountComplete, accountToDelete);
            }
            catch (SystemException se)
            { 
                _syncContext.Send(new SendOrPostCallback(showErrorDetails), se); 
            }
        }

        /// <summary>
        /// Ends the Delete message and tries to retrieve multiple accounts
        /// </summary>
        /// <param name="result"></param>
        private void OnDeleteAccountComplete(IAsyncResult result)
        {
            try
            {
                Account deletedAccount = result.AsyncState as Account;
                _context.EndSaveChanges(result);
                
                MessagePanel.Children.Add(new TextBlock() { Text = 
                    String.Format("The Account named \"{0}\" was deleted.",
                        deletedAccount.Name) });

                //Retrieve multiple Accounts
                BeginRetrieveAccounts();
            }
            catch (SystemException se)
            { 
                _syncContext.Send(new SendOrPostCallback(showErrorDetails), se); 
            }            
        }

        /// <summary>
        /// Retrieves the first 5 accounts found.
        /// </summary>
        private void BeginRetrieveAccounts()
        {
            //Retrieve 5 accounts
            int numberToRetrieve = 5;
            DataServiceQuery<Account> accounts = (DataServiceQuery<Account>)this._context
                .AccountSet.Take<Account>(numberToRetrieve);

            MessagePanel.Children.Add(new TextBlock() { Text = 
                String.Format("Retrieving the first {0} accounts:",
                    numberToRetrieve) });

            try
            {                 
                accounts.BeginExecute(OnRetrieveAccountsComplete, accounts); 
            }
            catch (DataServiceQueryException dsqe)
            {
                _syncContext.Send(new SendOrPostCallback(showErrorDetails), dsqe);
            }
        }
        
        /// <summary>
        /// Displays the names from any Accounts retrieved.
        /// </summary>
        /// <param name="result"></param>
        private void OnRetrieveAccountsComplete(IAsyncResult result)
        {
            //Retrieve the query that was 
            DataServiceQuery<Account> results = result.AsyncState as DataServiceQuery<Account>;

            try
            {
                //Create a collection of Accounts and set it equal to the query result
                ObservableCollection<Account> _accounts = 
                    new DataServiceCollection<Account>(results.EndExecute(result));
                
                //For each Account found, display the Account Name
                foreach (Account account in _accounts)
                {
                    MessagePanel.Children.Add(new TextBlock() { Text = account.Name });
                }

                MessagePanel.Children.Add(new TextBlock()
                {
                    Text = "Create, Retrieve, Update, and Delete Operations Complete."
                });
            }
            catch (SystemException se)
            {
                _syncContext.Send(new SendOrPostCallback(showErrorDetails), se);
            }
        }

        /// <summary>
        /// Will display exception details if an exception is caught.
        /// </summary>
        /// <param name="ex">An System.Exception object</param>
        private void showErrorDetails(object ex)
        {
            //Assure the control is visible
            MessagePanel.Visibility = System.Windows.Visibility.Visible;

            Exception exception = (Exception)ex;
            String type = exception.GetType().ToString();

            MessagePanel.Children.Add(new TextBlock() { Text = 
                String.Format("{0} Message: {1}", type, exception.Message) });

            MessagePanel.Children.Add(new TextBlock() { Text = 
                String.Format("Stack: {0}", exception.StackTrace) });

            if (exception.InnerException != null)
            {
                String exceptType = exception.InnerException.GetType().ToString();
                MessagePanel.Children.Add(new TextBlock() { Text = 
                    String.Format("InnerException: {0} : {1}", exceptType, 
                        exception.InnerException.Message) });
            }
        }
    }
}
//</snippetMainPageCS>
