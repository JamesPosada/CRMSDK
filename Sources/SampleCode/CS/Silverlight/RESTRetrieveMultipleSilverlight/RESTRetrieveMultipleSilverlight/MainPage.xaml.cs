//<snippetRESTRetrieveMultipleSilverlightCS>
using System;
using System.Collections.ObjectModel;
using System.Data.Services.Client;
using System.Linq;
using System.Threading;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using Microsoft.Crm.Sdk.Samples.CrmODataService;


namespace Microsoft.Crm.Sdk.Samples
{
 public partial class MainPage : UserControl
 {
  private SynchronizationContext _syncContext;
  private CrmContext _context;
  private String _serverUrl;
  public DataServiceCollection<Account> AccountCollection;

  public MainPage()
  {
   InitializeComponent();

   //Keeps a reference to the UI thread
   _syncContext = SynchronizationContext.Current;


   //Get the ServerUrl 
   _serverUrl = ServerUtility.GetServerUrl();



   if (!String.IsNullOrEmpty(_serverUrl))
   {

    //Setup Context
    _context = new CrmContext(
        new Uri(String.Format("{0}/xrmservices/2011/organizationdata.svc/",
            _serverUrl), UriKind.Absolute));

    //This is important because if the entity has new 
    //attributes added the code will fail.
    _context.IgnoreMissingProperties = true;

    // load the page with an initial 100 account records
    RetrieveAccounts(100);


   }
   else
   {
    String errorMessage = "Unable to access server url. Launch this Silverlight Web Resource from a CRM Form OR host it in a valid HTML Web Resource with a <script src='../ClientGlobalContext.js.aspx' type='text/javascript'></script>";
    showErrorDetails(new Exception(errorMessage));
    btnRetrieveAccounts.IsEnabled = false;
   }


  }

  private void btnRetrieveAccounts_Click(object sender, RoutedEventArgs e)
  {
   AccountCollection = null;
   ComboBoxItem selection = (ComboBoxItem)NumberOfAccountsToRetrieve.SelectedItem;
   switch ((String)selection.Content)
   {
    case "100":
     RetrieveAccounts(100);
     break;
    case "300":
     RetrieveAccounts(300);
     break;
    case "600":
     RetrieveAccounts(600);
     break;
    case "900":
     RetrieveAccounts(900);
     break;
   }
  }

  private void RetrieveAccounts(int number)
  {
   try
   {

    DataServiceQuery<Account> query = (DataServiceQuery<Account>)_context.AccountSet
     .AddQueryOption("$top", number)
     .AddQueryOption("$select", "Name,Telephone1");



    query.BeginExecute(ProcessPages<Account>, new PagingContext<Account>()
    {
     ServiceContext = _context,
     Query = query,
     PageProcessor = delegate(DataServiceCollection<Account> results)
     {
      try
      {

       if (null == AccountCollection)
       {
        AccountCollection = new DataServiceCollection<Account>(_context);
        AccountCollection.Load(results);
       }
       else
       {
        for (int i = 0; i < results.Count; i++)
        {
         AccountCollection.Add(results[i]);
        }
       }

       AccountsGrid.ItemsSource = AccountCollection;
      }
      catch (Exception ex)
      {
       _syncContext.Send(new SendOrPostCallback(showErrorDetails), ex);
      }

      return true;
     }
    });

   }
   catch (SystemException ex)
   {
    _syncContext.Send(new SendOrPostCallback(showErrorDetails), ex);
   }


  }

  private static void ProcessPages<T>(IAsyncResult result)
  {
   try
   {
    PagingContext<T> context = (PagingContext<T>)result.AsyncState;

    QueryOperationResponse<T> response;
    if (null == context.Query)
    {
     response = (QueryOperationResponse<T>)context.ServiceContext.EndExecute<T>(result);
    }
    else
    {
     response = (QueryOperationResponse<T>)context.Query.EndExecute(result);
     context.Query = null;
    }

    DataServiceCollection<T> results = new DataServiceCollection<T>(response);

    if (null != context.PageProcessor && !context.PageProcessor(results))
    {
     //Stop processing
     return;
    }

    DataServiceQueryContinuation<T> token = results.Continuation;
    if (null == token)
    {
     return;
    }

    context.ServiceContext.BeginExecute(token, ProcessPages<T>, context);
   }
   catch (Exception ex)
   {
    throw ex;
   }
  }

  public void showErrorDetails(object ex)
  {
   //Assure the control is visible
   this.MessageArea.Visibility = System.Windows.Visibility.Visible;

   this.AccountsGrid.Visibility = System.Windows.Visibility.Collapsed;


   Exception exception = (Exception)ex;
   String type = exception.GetType().ToString();

   this.Errors.Children.Add(new TextBlock() { TextWrapping = System.Windows.TextWrapping.Wrap, Text = String.Format("{0} Message: {1}", type, exception.Message) });
   this.Errors.Children.Add(new TextBlock() { TextWrapping = System.Windows.TextWrapping.Wrap, Text = String.Format("Stack: {0}", exception.StackTrace) });
   if (exception.InnerException != null)
   {
    String exceptType = exception.InnerException.GetType().ToString();
    this.Errors.Children.Add(new TextBlock() { TextWrapping = System.Windows.TextWrapping.Wrap, Text = String.Format("InnerException: {0} : {1}", exceptType, exception.InnerException.Message) });
   }
  }

 }

 sealed class PagingContext<T>
 {
  public DataServiceContext ServiceContext { get; set; }

  public DataServiceQuery<T> Query { get; set; }

  public Func<DataServiceCollection<T>, bool> PageProcessor { get; set; }
 }



}
//</snippetRESTRetrieveMultipleSilverlightCS>