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
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Ink;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace RESTSilverlightContactEditor.CrmODataService
{

    /// <summary>
    /// Extend the Contact class to provide custom validation
    /// on the business object directly.
    /// </summary>
    [CustomValidation(typeof(ContactValidator), "IsValidLastName")]
    [CustomValidation(typeof(ContactValidator), "IsValidEmail")]
    public partial class Contact
    {

    }

    /// <summary>
    /// ContactValidator is used to validate data on the Contact class.
    /// </summary>
    public static class ContactValidator
    {
        /// <summary>
        /// Validates Last Name is supplied.
        /// </summary>
        /// <param name="contactObject"></param>
        /// <param name="context"></param>
        /// <returns></returns>
        public static ValidationResult IsValidLastName(object contactObject, ValidationContext context)
        {
            ValidationResult validationResult = ValidationResult.Success; //Assume success
            Contact contact = contactObject as Contact;

            String lastName = contact.LastName;

            if (String.IsNullOrEmpty(lastName))
            {
                List<string> properties = new List<string>() { "LastName" };
                validationResult = new ValidationResult("Last Name cannot be empty!", properties);
            }

            return validationResult;
        }

        /// <summary>
        /// Validates email is valid if it is supplied.
        /// </summary>
        /// <param name="contactObject"></param>
        /// <param name="context"></param>
        /// <returns></returns>
        public static ValidationResult IsValidEmail(object contactObject, ValidationContext context)
        {
            String MatchEmailPattern =
               @"^(([\w-]+\.)+[\w-]+|([a-zA-Z]{1}|[\w-]{2,}))@" +
               @"((([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\." +
               @"([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])){1}|" +
               @"([a-zA-Z]+[\w-]+\.)+[a-zA-Z]{2,4})$";

            ValidationResult validationResult = ValidationResult.Success; //Assume success
            Contact contact = contactObject as Contact;

            String email = contact.EMailAddress1;

            //If they supplied an email address, validate it.
            if (!String.IsNullOrEmpty(email))
            {
                //If the email matches the pattern
                if (!Regex.IsMatch(email, MatchEmailPattern))
                {
                    List<String> properties = new List<String>() { "EMailAddress1" };
                    validationResult = new ValidationResult("Email is invalid.", properties);
                }
            }
            return validationResult;
        }
    }

}
