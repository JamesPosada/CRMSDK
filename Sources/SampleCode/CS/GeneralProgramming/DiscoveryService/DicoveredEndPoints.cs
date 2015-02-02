using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Discovery;

namespace Microsoft.Crm.Sdk.Samples {
   public class DicoveredEndPoints {
        private DiscoveryServiceProxy _serviceProxy;

       public DicoveredEndPoints() {
            ServerConnection serverConnect = new ServerConnection();
            ServerConnection.Configuration config = serverConnect.GetServerConfiguration();
            using (_serviceProxy = new DiscoveryServiceProxy(config.DiscoveryUri,
                                                                      config.HomeRealmUri,
                                                                      config.Credentials,
                                                                      config.DeviceCredentials)) {

                // You can choose to use the interface instead of the proxy.
                IDiscoveryService service = _serviceProxy;
                RetrieveOrganizationsRequest orgsRequest =
                         new RetrieveOrganizationsRequest() {
                             AccessType = EndpointAccessType.Default,
                             Release = OrganizationRelease.Current
                         };
                RetrieveOrganizationsResponse organizations =
                    (RetrieveOrganizationsResponse)service.Execute(orgsRequest);
                foreach (OrganizationDetail organization in organizations.Details) {
                    Console.WriteLine("Organization Name: {0}", organization.FriendlyName);
                    Console.WriteLine("Unique Name: {0}", organization.UniqueName);
                    Console.WriteLine("Endpoints:");
                    foreach (var endpoint in organization.Endpoints) {
                        Console.WriteLine("  Name: {0}", endpoint.Key);
                        Console.WriteLine("  URL: {0}", endpoint.Value);
                    }
                }
                
            }

        }
    }
}
