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
using System.Collections.ObjectModel;
using System.ComponentModel;
using RESTSilverlightContactEditor.CrmODataService;
using System.Windows.Data;
using System.ComponentModel.DataAnnotations;

namespace RESTSilverlightContactEditor
{
    public class MainViewModel : INotifyPropertyChanged
    {
        //Supplies the collection of Contacts that the Mainpage.ContactList binds to
        public ObservableCollection<Contact> Contacts { get; set; }

        //An object to represent the Contact currently selected in the MainPage.ContactList itemscontrol. 
        //It is also bound to from the detail area textboxes allowing data entry.
        private Contact _selectedContact;
        public Contact SelectedContact
        {
            get { return _selectedContact; }
            set
            {
                _selectedContact = value;
                NotifyPropertyChanged("SelectedContact");
            }
        }

        //Declare the PropertyChanged event
        public event PropertyChangedEventHandler PropertyChanged;

        /// <summary>
        /// NotifyPropertyChanged will raise the PropertyChanged event passing the
        /// source property's name that is being updated. 
        /// </summary>
        /// <param name="propertyName"></param>
        public void NotifyPropertyChanged(String propertyName)
        {
            if (PropertyChanged != null)
            {
                PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
            }
        }

        public MainViewModel()
        {
            Contacts = new ObservableCollection<Contact>();
            SelectedContact = null;
        }
    }
}
