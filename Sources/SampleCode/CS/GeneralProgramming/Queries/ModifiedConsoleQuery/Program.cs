using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CRMConnection;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk;
using FREZZORCrm;
namespace ModifiedConsoleQuery {
    class Program {

        
        static void Main(string[] args) {

            var context = new ContextBuilder().GetQuerableContext();

            //CrmConnectionConfiguration c = new CrmConnectionConfiguration();


            var cons = context.ContactSet.Where(x => x.EMailAddress1.Contains("James"));
              
            foreach (var a in cons) {
                 Console.WriteLine(a.FirstName + " " + a.LastName);
             
            
           }

            Console.ReadLine();
        }
    }
}
