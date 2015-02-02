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
//<snippetConfirmationDialog>
using System;
using System.Windows;
using System.Windows.Controls;

namespace Microsoft.Crm.Sdk.Samples
{
    public partial class ConfirmationDialog : ChildWindow
    {
        internal object State { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="state">
        /// An object that will be stored for when the dialog closes.
        /// </param>
        public ConfirmationDialog(object state, String confirmationText, String title)
        {
            State = state;
            Title = title;
            // Create a ViewModel for the confirmation text binding.
            DataContext = new ConfirmationViewModel(confirmationText);
            InitializeComponent();
        }

        /// <summary>
        /// Handles the OK Button and sets result to true, representing delete.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OKButton_Click(object sender, RoutedEventArgs e)
        {
            this.DialogResult = true;
        }

        /// <summary>
        /// Handles the Cancel Button and sets result to false, representing do not
        /// delete.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void CancelButton_Click(object sender, RoutedEventArgs e)
        {
            this.DialogResult = false;
        }
    }
}
//</snippetConfirmationDialog>
