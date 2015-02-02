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
//<snippetDeleteConfirmationCS>
using System.Windows;
using System.Windows.Controls;
using Microsoft.Crm.Sdk.Samples.CrmODataService;


namespace Microsoft.Crm.Sdk.Samples
{
    public partial class DeleteConfirmation : ChildWindow
    {        
        internal Account accountForDeletion;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="accountForDeletion">The Account to be deleted</param>
        public DeleteConfirmation(Account accountForDeletion)
        {            
            InitializeComponent();
            this.accountForDeletion = accountForDeletion;            
        }

        /// <summary>
        /// Handles the OK Button and sets result to true, representing delete
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OKButton_Click(object sender, RoutedEventArgs e)
        {
            this.DialogResult = true;
        }

        /// <summary>
        /// Handles the Cancel Button and sets result to false, representing do not delete
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void CancelButton_Click(object sender, RoutedEventArgs e)
        {
            this.DialogResult = false;
        }
    }
}
//</snippetDeleteConfirmationCS>
