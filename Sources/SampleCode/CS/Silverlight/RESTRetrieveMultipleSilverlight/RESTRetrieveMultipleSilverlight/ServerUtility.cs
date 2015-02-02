//<snippetRESTRetrieveMultipleSilverlightServerUtilityCS>
using System;
using System.Windows.Browser;

namespace Microsoft.Crm.Sdk.Samples
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
//</snippetRESTRetrieveMultipleSilverlightServerUtilityCS>