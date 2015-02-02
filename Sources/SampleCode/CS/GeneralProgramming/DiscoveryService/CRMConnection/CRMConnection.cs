using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel.Description;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Microsoft.Crm.Sdk.Samples;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Discovery;
using FREZZORCrm;

namespace CRMConnection {
    public class ContextBuilder : ServerConnection {


        public Configuration serverConfig { get; protected set; }

        static CrmConnectionConfiguration _serverconfig;
       
        public ContextBuilder() {
            ContextBuilder.CrmConnectionConfiguration.TheConfigs.Refresh();

        }


        public FREZZORCrm.FrezzorCRMContext GetQuerableContext() {
            var context = ServerConnection.GetOrganizationProxy(_serverconfig);
            context.EnableProxyTypes((System.Reflection.Assembly.GetAssembly(typeof(FrezzorCRMContext))));
            return new FrezzorCRMContext(context);
        }



        //public Configuration GetServerConfiguration() {


            
        //    base.configurations = new List<Configuration>();
        //    var con = _serverconfig;
        //    base.configurations.Add(con);
        //    return base.configurations[base.configurations.Count - 1];
        //}


        /// <summary>
        /// Generic method to obtain discovery/organization service proxy instance.
        /// </summary>
        /// <typeparam name="TService">
        /// Set IDiscoveryService or IOrganizationService type 
        /// to request respective service proxy instance.
        /// </typeparam>
        /// <typeparam name="TProxy">
        /// Set the return type to either DiscoveryServiceProxy 
        /// or OrganizationServiceProxy type based on TService type.
        /// </typeparam>
        /// <param name="currentConfig">An instance of existing Configuration</param>
        /// <returns>An instance of TProxy 
        /// i.e. DiscoveryServiceProxy or OrganizationServiceProxy</returns>
        public TProxy GetCrmProxy<TProxy, TService>()
            where TService : class
            where TProxy : ServiceProxy<TService> {

            return ServerConnection.GetProxy<TService, TProxy>(serverConfig);


        }






        private class CrmConnectionConfiguration : ServerConnection.Configuration {
            DiscoveryServiceProxy _serviceProxy;

            private CrmConnectionConfiguration() {
                base.Credentials = new ClientCredentials();
                base.Credentials.Windows.ClientCredential = new System.Net.NetworkCredential() {
                    UserName = "",
                    Password = "",
                    Domain = ""
                };


                base.ServerAddress = "https://frezzor.dataresolution.net";
                base.DiscoveryUri = new Uri(string.Format("{0}/XRMServices/2011/Discovery.svc", base.ServerAddress));
                base.EndpointType = AuthenticationProviderType.Federation;
                GetOrgDeatils();
                base.OrganizationUri = new Uri(orgDetails.Endpoints[Microsoft.Xrm.Sdk.Discovery.EndpointType.OrganizationService]);
                base.OrganizationName = orgDetails.FriendlyName;


            }
            OrganizationDetail orgDetails;

            internal void GetOrgDeatils() {
                base.Credentials.UserName.UserName = base.Credentials.Windows.ClientCredential.UserName;
                base.Credentials.UserName.Password = base.Credentials.Windows.ClientCredential.Password;

                using (_serviceProxy = new DiscoveryServiceProxy(base.DiscoveryUri,
                                                                       base.HomeRealmUri,
                                                                       base.Credentials,
                                                                       base.DeviceCredentials)) {
                    IDiscoveryService service = _serviceProxy;
                    RetrieveOrganizationsRequest orgsRequest =
                        new RetrieveOrganizationsRequest() {
                            AccessType = EndpointAccessType.Default,
                            Release = OrganizationRelease.Current
                        };
                    RetrieveOrganizationsResponse organizations =
                        (RetrieveOrganizationsResponse)service.Execute(orgsRequest);
                    orgDetails = organizations.Details[0];
                }
            }
            
            public static class TheConfigs{
                public static void Refresh(){
                    if(ContextBuilder._serverconfig == null){
                        ContextBuilder._serverconfig = new CrmConnectionConfiguration();
                    }
                }
        }


            }
            
           
        }


    }

   