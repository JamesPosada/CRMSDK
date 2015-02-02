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
using System.Windows.Browser;

namespace RESTSilverlightContactEditor
{

    public static class ServerUtility
    {
        /// <summary>
        /// Returns the ServerUrl from Microsoft Dynamics CRM
        /// </summary>
        /// <returns>String representing the ServerUrl or String.Empty if not found.</returns>
        public static String GetServerUrl()
        {
            String serverUrl = String.Empty;

            //Try to get the ServerUrl from the Xrm.Page object
            serverUrl = GetServerUrlFromContext();

            return serverUrl;
        }

        /// <summary>
        /// Attempts to retrieve the ServerUrl from the Xrm.Page object
        /// </summary>
        /// <returns></returns>
        private static String GetServerUrlFromContext()
        {
            try
            {
                // If the Silverlight is in a form, this will get the server url
                ScriptObject xrm = (ScriptObject)HtmlPage.Window.GetProperty("Xrm");
                ScriptObject page = (ScriptObject)xrm.GetProperty("Page");
                ScriptObject pageContext = (ScriptObject)page.GetProperty("context");

                String serverUrl = (String)pageContext.Invoke("getServerUrl");

                return serverUrl;
            }
            catch
            {
                return String.Empty;
            }
        }
    }

}
