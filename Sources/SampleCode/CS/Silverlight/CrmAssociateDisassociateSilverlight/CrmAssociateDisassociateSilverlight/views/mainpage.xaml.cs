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
//<snippetMainPage>
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using System.Threading;
using System.Windows;
using System.Windows.Controls;
using Microsoft.Crm.Sdk.Samples.CrmODataService;
using System.Windows.Browser;

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

            // Keep a reference to the UI thread.
            _syncContext = SynchronizationContext.Current;

            // Get the ServerUrl (ServerUrl is formatted differently OnPremise than
            // OnLine).
            _serverUrl = ServerUtility.GetServerUrl(); 

            if (!String.IsNullOrEmpty(_serverUrl))
            {
                
                // Setup context.
                _context = new AdventureWorksCycleContext(
                    new Uri(String.Format("{0}/xrmservices/2011/organizationdata.svc/", 
                        _serverUrl), UriKind.Absolute));

                //This is important because if the entity has new 
                //attributes added the code will fail.
                _context.IgnoreMissingProperties = true;
            }
            else
            {
                // No ServerUrl was found. Display a message.
                SendMessage(
                        "Unable to access server url. Launch this Silverlight " + 
                        "Web Resource from a CRM Form OR host it in a valid " + 
                        "HTML Web Resource with a " + 
                        "<script src='../ClientGlobalContext.js.aspx' " + 
                        "type='text/javascript'></script>" 
                );
            }
        }

        private void ShowAccountsSample_Click(object sender, RoutedEventArgs e)
        {
            // First, create some example accounts to link together.
            BeginCreateExampleAccounts();
            ShowAccountsSample.Visibility = Visibility.Collapsed;
            ShowActivityPartySample.Visibility = Visibility.Collapsed;
        }

        private void ShowActivityPartySample_Click(object sender, RoutedEventArgs e)
        {
            // First, create an example account and e-mail.
            BeginCreateAccountAndEmail();
            ShowAccountsSample.Visibility = Visibility.Collapsed;
            ShowActivityPartySample.Visibility = Visibility.Collapsed;
        }

        #region AccountsAssociation

        /// <summary>
        /// Create 2 example accounts for associating and disassociating.
        /// </summary>
        private void BeginCreateExampleAccounts()
        {
            var account1 = new Account
            {
                Name = String.Format(
                    "AssociateDisassociateExample1 {0}", DateTime.Now.ToString())
            };

            var account2 = new Account
            {
                Name = String.Format(
                    "AssociateDisassociateExample2 {0}", DateTime.Now.ToString())
            };

            _context.AddToAccountSet(account1);
            _context.AddToAccountSet(account2);
            var accounts = new List<Account> { account1, account2 };
            _context.BeginSaveChanges(OnExampleAccountsCreated, accounts);
        }

        /// <summary>
        /// Notifies when the Example Accounts have been created, then delegates to a
        /// a method that associates the accounts.
        /// </summary>
        /// <param name="result"></param>
        private void OnExampleAccountsCreated(IAsyncResult result)
        {
            try
            {
                _context.EndSaveChanges(result);
                var accounts = (List<Account>)result.AsyncState;
                foreach (var account in accounts)
                {
                    NotifyAccountCreation(account);
                }

                // Associate the accounts we just created.
                BeginAssociateAccounts(accounts);
            }
            catch (SystemException se)
            {
                _syncContext.Send(new SendOrPostCallback(showErrorDetails), se);
            }
        }

        /// <summary>
        /// Associated 2 accounts, making the first account the parent of the second
        /// account.
        /// </summary>
        /// <param name="accounts"></param>
        private void BeginAssociateAccounts(List<Account> accounts)
        {
            Debug.Assert(accounts.Count == 2);

            // This will make accounts[0] the parent of accounts[1].
            _context.AddLink(
                accounts[0], "Referencedaccount_parent_account", accounts[1]);

            _context.BeginSaveChanges(OnAccountsAssociated, accounts);
        }

        /// <summary>
        /// Notify the user when the accounts have been associated.  Ask if they should
        /// be disassociated.
        /// </summary>
        /// <param name="result"></param>
        private void OnAccountsAssociated(IAsyncResult result)
        {
            try
            {
                _context.EndSaveChanges(result);
                var accounts = (List<Account>)result.AsyncState;
                Debug.Assert(accounts.Count == 2);

                var account1 = accounts[0];
                var account2 = accounts[1];

                var message = new StringBuilder();
                message.AppendLine(String.Format(
                    "Account \"{0}\" ({1})", account1.Name, account1.AccountId));
                message.AppendFormat("\tis now the parent of Account \"{0}\" ({1})",
                    account2.Name, account2.AccountId);

                SendMessage(message.ToString());

                // Ask the user to confirm whether the accounts should be disassociated.
                var confirm = new ConfirmationDialog(accounts,
                    "Do you want to disassociate the accounts?",
                    "Disassociate Confirmation");
                confirm.Closed += OnDisassociateAccountsConfirmClosed;
                confirm.Show();
            }
            catch (SystemException se)
            {
                _syncContext.Send(new SendOrPostCallback(showErrorDetails), se);
            }
        }

        /// <summary>
        /// Decide whether to disassociate the accounts or skip this step, based on the
        /// user's input.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OnDisassociateAccountsConfirmClosed(object sender, EventArgs e)
        {
            var dialog = (ConfirmationDialog)sender;
            if (dialog.DialogResult.HasValue && dialog.DialogResult.Value)
            {
                BeginDisassociateAccounts((List<Account>)dialog.State);
            }
            else
            {
                // Skip disassociation and ask if the user wants to delete the accounts.
                ConfirmDeleteAccounts((List<Account>)dialog.State);
            }
        }

        /// <summary>
        /// Disassociate 2 accounts, removing the parent-child relationship between the
        /// first account and the second account.
        /// </summary>
        /// <param name="accounts">the accounts to disassociate</param>
        private void BeginDisassociateAccounts(List<Account> accounts)
        {
            Debug.Assert(accounts.Count == 2);
            _context.DeleteLink(
                accounts[0], "Referencedaccount_parent_account", accounts[1]);
            _context.BeginSaveChanges(OnDisassociateAccountsComplete, accounts);
        }

        /// <summary>
        /// Notify the user when the accounts have been disassociated.
        /// </summary>
        /// <param name="result"></param>
        private void OnDisassociateAccountsComplete(IAsyncResult result)
        {
            try
            {
                _context.EndSaveChanges(result);
                var accounts = (List<Account>)result.AsyncState;
                Debug.Assert(accounts.Count == 2);

                var account1 = accounts[0];
                var account2 = accounts[1];

                var message = new StringBuilder();

                message.AppendLine(String.Format(
                    "Account \"{0}\" ({1})", account1.Name, account1.AccountId));

                message.AppendFormat(
                    "\tis no longer the parent of Account \"{0}\" ({1})",
                    account2.Name, account2.AccountId);

                SendMessage(message.ToString());
                ConfirmDeleteAccounts(accounts);
            }
            catch (SystemException se)
            {
                _syncContext.Send(new SendOrPostCallback(showErrorDetails), se);
            }
        }

        /// <summary>
        /// Ask the user to confirm if the accounts should be deleted.
        /// </summary>
        /// <param name="accounts">accounts to be stored in the dialog's state</param>
        private void ConfirmDeleteAccounts(List<Account> accounts)
        {
            var confirm = new ConfirmationDialog(accounts,
                    "Do you want to delete the accounts?", "Delete confirmation");
            confirm.Closed += OnDeleteAccountsConfirmClosed;
            confirm.Show();
        }

        /// <summary>
        /// Delete the accounts if the user confirms that they should be deleted.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OnDeleteAccountsConfirmClosed(object sender, EventArgs e)
        {
            var dialog = (ConfirmationDialog)sender;
            // Retrieve the accounts from the dialog's state.
            var accounts = (List<Account>)dialog.State;
            if (dialog.DialogResult.HasValue && dialog.DialogResult.Value)
            {
                BeginDeleteAccounts(accounts);
            }
            else
            {
                // Show the user where they can view the records.
                SendMessage("You decided not to delete the records.");
                SendHyperlink("View them here.", String.Format(
                    "etn=account&pagetype=entityrecord&id=%7B{0}%7D",
                    accounts[1].AccountId));
            }
        }

        /// <summary>
        /// Delete the passed in accounts.
        /// </summary>
        /// <param name="accounts">the accounts to delete</param>
        private void BeginDeleteAccounts(List<Account> accounts)
        {
            foreach (var account in accounts)
            {
                _context.DeleteObject(account);
            }
            _context.BeginSaveChanges(OnAccountsDeleted, accounts);
        }

        /// <summary>
        /// When the accounts have been deleted, notify the user.
        /// </summary>
        /// <param name="result"></param>
        private void OnAccountsDeleted(IAsyncResult result)
        {
            try
            {
                _context.EndSaveChanges(result);
                var accounts = (List<Account>)result.AsyncState;
                Debug.Assert(accounts.Count == 2);

                var account1 = accounts[0];
                var account2 = accounts[1];

                var message = new StringBuilder();

                message.AppendLine(String.Format(
                    "Account \"{0}\" ({1})", account1.Name, account1.AccountId));

                message.AppendLine(String.Format(
                    "\tand Account \"{0}\" ({1})",
                    account2.Name, account2.AccountId));

                message.AppendFormat("\thave been deleted.");

                SendMessage(message.ToString());
            }
            catch (SystemException se)
            {
                _syncContext.Send(new SendOrPostCallback(showErrorDetails), se);
            }
        }

        #endregion

        #region AccountAndEmailAssociation

        /// <summary>
        /// Creates an example Account and Email for use in the rest of the sample.
        /// </summary>
        private void BeginCreateAccountAndEmail()
        {
            var account = new Account
            {
                Name = String.Format(
                    "ActivityPartyAssociateExample {0}", DateTime.Now.ToString())
            };
            _context.AddToAccountSet(account);

            var email = new Email
            {
                Subject = String.Format(
                    "ActivityPartyAssociateExample {0}", DateTime.Now.ToString())
            };

            _context.AddToEmailSet(email);

            _context.BeginSaveChanges(OnAccountAndEmailCreated,
                new Tuple<Email, Account>(email, account));
        }

        /// <summary>
        /// Notifies the user once the e-mail and account have been created.
        /// </summary>
        /// <param name="result"></param>
        private void OnAccountAndEmailCreated(IAsyncResult result)
        {
            try
            {
                _context.EndSaveChanges(result);
                var emailAndAccount = (Tuple<Email, Account>)result.AsyncState;
                NotifyAccountCreation(emailAndAccount.Item2);
                NotifyEmailCreation(emailAndAccount.Item1);
                BeginCreateActivityParty(emailAndAccount);
            }
            catch (SystemException se)
            {
                _syncContext.Send(new SendOrPostCallback(showErrorDetails), se);
            }
        }

        /// <summary>
        /// Creates an ActivityParty entity to associate the account and the e-mail.
        /// ActivityParty serves as the junction entity between e-mails and accounts in
        /// the relationship between accounts and e-mails (and between other activities
        /// and parties).
        /// </summary>
        /// <param name="emailAndAccount"></param>
        private void BeginCreateActivityParty(Tuple<Email, Account> emailAndAccount)
        {
            var email = emailAndAccount.Item1;
            var account = emailAndAccount.Item2;
            var activityParty = new ActivityParty();

            // Set the "activity" of the ActivityParty (the e-mail, in this case).
	        activityParty.ActivityId = new EntityReference()
		    {
			    Id = email.ActivityId, LogicalName = "email"
		    };

            // Set the "party" of the ActivityParty (what will be related to the
            // activity).
		    activityParty.PartyId = new EntityReference()
            {
                Id = account.AccountId,
                LogicalName = "account"
            };
		    
            // Set the participation type (what role the party has on the activity). For
            // this example, we'll put the account in the From field (which has a value of
            // 1).
		    activityParty.ParticipationTypeMask = new OptionSetValue()
            {
                Value = 1
            };

            _context.AddToActivityPartySet(activityParty);
            _context.BeginSaveChanges(OnActivityPartyCreated,
                new Tuple<Email, Account, ActivityParty>(email, account, activityParty));
        }

        /// <summary>
        /// Notify the user that the activity party has been created, link the account
        /// to the e-mail.
        /// </summary>
        /// <param name="result"></param>
        private void OnActivityPartyCreated(IAsyncResult result)
        {
            try
            {
                _context.EndSaveChanges(result);
                var triple = (Tuple<Email, Account, ActivityParty>)result.AsyncState;
                SendMessage(
                    "Created Activity Party; the Account and Email are now related");

                // Disassociating an activity and a party (deleting the activityparty)
                // record is not supported by OData; otherwise, we would include that
                // option here.

                // Confirm whether the user wishes to delete the account and e-mail.
                var confirm = new ConfirmationDialog(triple,
                    "Do you want to delete the account and e-mail?",
                    "Deletion confirmation");
                confirm.Closed += OnDeleteAccountAndEmailConfirmClosed;
                confirm.Show();
            }
            catch (SystemException se)
            {
                _syncContext.Send(new SendOrPostCallback(showErrorDetails), se);
            }
        }

        /// <summary>
        /// If the user wanted account and e-mail deleted, delete them.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OnDeleteAccountAndEmailConfirmClosed(object sender, EventArgs e)
        {
            var dialog = (ConfirmationDialog)sender;
            var triple = (Tuple<Email, Account, ActivityParty>)dialog.State;
            if (dialog.DialogResult.HasValue && dialog.DialogResult.Value)
            {
                _context.DeleteObject(triple.Item1);
                _context.DeleteObject(triple.Item2);
                _context.BeginSaveChanges(OnAccountAndEmailDeleted, triple);
            }
            else
            {
                // Show the user where they can view the records.
                SendMessage("You decided not to delete the records.");
                SendHyperlink("View them here.", String.Format(
                    "etn=email&pagetype=entityrecord&id=%7B{0}%7D",
                    triple.Item1.ActivityId));
            }
        }

        /// <summary>
        /// Notify the user that the account and e-mail were deleted.
        /// </summary>
        /// <param name="result"></param>
        private void OnAccountAndEmailDeleted(IAsyncResult result)
        {
            try
            {
                _context.EndSaveChanges(result);

                SendMessage("The Account and Email have been deleted.");
            }
            catch (SystemException se)
            {
                _syncContext.Send(new SendOrPostCallback(showErrorDetails), se);
            }
        }

        #endregion

        /// <summary>
        /// Displays a message in the MessagePanel.
        /// </summary>
        /// <param name="message">the message to send</param>
        private void SendMessage(String message)
        {
            MessagePanel.Children.Add(new TextBlock() { Text = message });
        }

        private void SendHyperlink(String text, String queryString)
        {
            dynamic window = HtmlPage.Window;
            var serverUrl = ServerUtility.GetServerUrl();

            var uri = new Uri(String.Format("{0}/main.aspx?{1}", serverUrl, queryString),
                UriKind.Absolute);
            MessagePanel.Children.Add(new HyperlinkButton
            {
                Content = new TextBlock { Text = text },
                NavigateUri = uri
            });
        }

        /// <summary>
        /// Notifies the user that an account has been created.
        /// </summary>
        /// <param name="account"></param>
        private void NotifyAccountCreation(Account account)
        {
            var message = new StringBuilder();
            message.AppendLine(
                String.Format("Created Account named \"{0}\"", account.Name));
            message.AppendFormat(
                "\twith AccountId = \"{0}\" for testing.", account.AccountId);
            SendMessage(message.ToString());
        }

        /// <summary>
        /// Notifies the user that an e-mail has been created.
        /// </summary>
        /// <param name="email"></param>
        private void NotifyEmailCreation(Email email)
        {
            var message = new StringBuilder();
            message.AppendLine(
                String.Format("Created Email with subject \"{0}\"", email.Subject));
            message.AppendFormat(
                "\tand ActivityId = \"{0}\" for testing.", email.ActivityId);
            SendMessage(message.ToString());
        }

        /// <summary>
        /// Will display exception details if an exception is caught.
        /// </summary>
        /// <param name="ex">An System.Exception object</param>
        private void showErrorDetails(object ex)
        {
            // Assure the control is visible.
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
//</snippetMainPage>