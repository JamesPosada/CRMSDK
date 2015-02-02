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
using System;
using System.Data.Services.Client;
using System.Linq;
using System.Threading;
using System.Windows;
using System.Windows.Controls;
using RESTSilverlightContactEditor.CrmODataService;
using System.Windows.Browser;

namespace RESTSilverlightContactEditor
{
    public partial class MainPage : UserControl
    {
        public MainViewModel TheMainViewModel { get; set; }
        private SynchronizationContext _syncContext;
        private AdventureWorksCycleContext _context;
        private String _serverUrl;

        public MainPage()
        {
            InitializeComponent();

            //Keeps a reference to the UI thread
            _syncContext = SynchronizationContext.Current;

            //Instantiate viewmodel object and set the view's DataContext
            TheMainViewModel = new MainViewModel();
            this.LayoutRoot.DataContext = TheMainViewModel;

            //Get the ServerUrl (ServerUrl is formatted differently OnPremise than OnLine)
            _serverUrl = ServerUtility.GetServerUrl();

            if (!String.IsNullOrEmpty(_serverUrl))
            {
                //Setup Context
                _context = new AdventureWorksCycleContext(new Uri(
                    String.Format("{0}/xrmservices/2011/organizationdata.svc/", _serverUrl), UriKind.Absolute));

                //This is important because if the entity has new attributes added the code will fail.
                _context.IgnoreMissingProperties = true;

                //Trigger a blank search (get all contacts)
                SearchContacts(String.Empty);
            }
            else
            {
                //No ServerUrl was found. Display an error message.
                Errors.Children.Add(new TextBlock()
                {
                    Text = "Unable to access server url. Launch this Silverlight Web Resource from a CRM Form OR host it in a valid HTML/ASPX Web Resource with a <script src='/WebResources/ClientGlobalContext.js.aspx' type='text/javascript'></script>"
                });
                MessageArea.Visibility = System.Windows.Visibility.Visible;
            }
        }


        /// <summary>
        /// Handles the SearchButton.Click event and triggers a search for Contacts. 
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void SearchButton_Click(object sender, RoutedEventArgs e)
        {
            String searchText = SearchText.Text;
            SearchContacts(searchText);
        }
        /// <summary>
        /// Handles the NewButton.Click and adds a new Contact object to the ViewModel
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void NewButton_Click(object sender, RoutedEventArgs e)
        {
            Contact c = new Contact();
            c.FirstName = "FirstName";
            c.LastName = "LastName";
            TheMainViewModel.Contacts.Add(c);
            TheMainViewModel.SelectedContact = c;
        }
        /// <summary>
        /// Handles the SaveButton.Click event and triggers the context to save any changes.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void SaveButton_Click(object sender, RoutedEventArgs e)
        {
            //First check to see if there are any Validation error on the ContactGrid, 
            //if so, notify user and don't save.
            if (!this.ContactGrid.IsValid)
            {
                HtmlPage.Window.Alert("Please correct all validation errors before saving!");
                return;
            }

            try
            {
                BeginSaveChanges();
            }
            catch (SystemException se)
            {
                _syncContext.Send(new SendOrPostCallback(showErrorDetails), se);
            }
        }
        /// <summary>
        /// Handles the DeleteButton.Click. Deletes the contact from the list and from
        /// Microsoft Dynamics CRM if applicable.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void DeleteButton_Click(object sender, RoutedEventArgs e)
        {
            //First check to see if there are any Validation error on the ContactGrid, 
            //if so, notify user and don't save.
            if (!this.ContactGrid.IsValid)
            {
                HtmlPage.Window.Alert("Please correct all validation errors before trying to delete.");
                return;
            }

            try
            {
                //Only attempt a delete if there is a Contact selected in the list.
                if (TheMainViewModel.SelectedContact != null)
                {
                    //The Contact exists in Microsoft Dynamics CRM, so tell the context to Delete it
                    if (TheMainViewModel.SelectedContact.ContactId != Guid.Empty)
                    {
                        _context.DeleteObject(TheMainViewModel.SelectedContact);
                        _context.BeginSaveChanges(OnDeleteContactComplete, TheMainViewModel.SelectedContact);
                    }
                    //The Contact has an empty Guid which means it was created in Silverlight 
                    //and never saved to Microsoft Dynamics CRM. Just remove it from the collection.
                    else
                    {
                        TheMainViewModel.Contacts.Remove(TheMainViewModel.SelectedContact);
                        TheMainViewModel.SelectedContact = null;
                    }
                }
            }
            catch (SystemException ex)
            {
                _syncContext.Send(new SendOrPostCallback(showErrorDetails), ex);
            }
        }


        /// <summary>
        /// Creates a DataServiceQuery and invokes asynchronous search for contacts.
        /// </summary>
        /// <param name="criteria"></param>
        private void SearchContacts(String criteria)
        {
            try
            {
                //Find all contacts
                if (String.IsNullOrEmpty(criteria))
                {
                    DataServiceQuery<Contact> query = (DataServiceQuery<Contact>)_context.ContactSet;
                    query.BeginExecute(OnContactSearchComplete, query);
                }
                //Find contacts based on FullName containing text.
                else
                {
                    DataServiceQuery<Contact> query = (DataServiceQuery<Contact>)_context.ContactSet.Where(c => c.FullName.Contains(criteria));
                    query.BeginExecute(OnContactSearchComplete, query);
                }
            }
            catch (SystemException ex)
            {
                _syncContext.Send(new SendOrPostCallback(showErrorDetails), ex);
            }
        }
        /// <summary>
        /// Callback method called after a search is finished. Updates the ViewModel and notifies the UI.
        /// </summary>
        /// <param name="result"></param>
        private void OnContactSearchComplete(IAsyncResult result)
        {
            try
            {
                //Get the original query back from the result.
                DataServiceQuery<Contact> query = result.AsyncState as DataServiceQuery<Contact>;

                //Update the ViewModel and notify the UI that Contacts collection has changed.
                TheMainViewModel.Contacts = new DataServiceCollection<Contact>(query.EndExecute(result));
                TheMainViewModel.NotifyPropertyChanged("Contacts");
            }
            catch (SystemException se)
            {
                _syncContext.Send(new SendOrPostCallback(showErrorDetails), se);
            }
        }
        /// <summary>
        /// Invokes context to save changes.
        /// </summary>
        private void BeginSaveChanges()
        {
            _context.BeginSaveChanges(OnSaveContactsComplete, TheMainViewModel.Contacts);
        }
        /// <summary>
        /// Callback method called after a save. Completes the save.
        /// </summary>
        /// <param name="result"></param>
        private void OnSaveContactsComplete(IAsyncResult result)
        {
            try
            {
                _context.EndSaveChanges(result);
            }
            catch (SystemException se)
            {
                _syncContext.Send(new SendOrPostCallback(showErrorDetails), se);
            }
        }
        /// <summary>
        /// Callback method after Delete operation. Removes the deleted contact from the list.
        /// </summary>
        /// <param name="result"></param>
        private void OnDeleteContactComplete(IAsyncResult result)
        {
            try
            {
                Contact deletedAccount = result.AsyncState as Contact;

                _context.EndSaveChanges(result);
                TheMainViewModel.Contacts.Remove(TheMainViewModel.SelectedContact);
                TheMainViewModel.SelectedContact = null;

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
            this.MessageArea.Visibility = System.Windows.Visibility.Visible;

            //Hide the other areas
            this.SearchArea.Visibility = System.Windows.Visibility.Collapsed;
            this.DataArea.Visibility = System.Windows.Visibility.Collapsed;
            this.CommandArea.Visibility = System.Windows.Visibility.Collapsed;

            Exception exception = (Exception)ex;
            String type = exception.GetType().ToString();

            this.Errors.Children.Add(new TextBlock() { Text = String.Format("{0} Message: {1}", type, exception.Message) });
            this.Errors.Children.Add(new TextBlock() { Text = String.Format("Stack: {0}", exception.StackTrace) });
            if (exception.InnerException != null)
            {
                String exceptType = exception.InnerException.GetType().ToString();
                this.Errors.Children.Add(new TextBlock() { Text = String.Format("InnerException: {0} : {1}", exceptType, exception.InnerException.Message) });
            }
        }


    }
}
