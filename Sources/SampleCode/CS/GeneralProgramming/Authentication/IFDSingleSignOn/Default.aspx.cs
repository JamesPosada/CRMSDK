using System;
using System.Linq;
using System.Threading;
using Microsoft.IdentityModel.Claims;

namespace ExternalCRM
{
	public partial class Default : System.Web.UI.Page
	{
		protected void Page_Load(object sender, EventArgs e)
		{
			this.txtName.Text = User.Identity.Name;
			this.lblBizId.Text = "Not ready";
			this.lblUserId.Text = "Not ready";
			this.lblFullName.Text = "Not ready";
			this.lblAccountId.Text = "Not ready yet";

			IClaimsIdentity claimsIdentity = ((IClaimsPrincipal)(Thread.CurrentPrincipal)).Identities[0];

			string upn = (from c in claimsIdentity.Claims
								where c.ClaimType == System.IdentityModel.Claims.ClaimTypes.Upn
								select c.Value).FirstOrDefault();

			this.lblUpn.Text = upn;

			CrmConnect crmConnect = new CrmConnect(
				new Uri("https://boots.smclaims02.com:555/xrmservices/2011/organization.svc"),
				new Uri("https://dev.smclaims02.com:555/xrmservices/2011/discovery.svc"),
				"Administrator@smclaims02DOM.extest.microsoft.com",
				"password");

            // Obtain and display some information about the logged on user.
			CrmInfo loggedInUser = crmConnect.DoCrmStuff(upn);
			this.lblBizId.Text = loggedInUser.CrmBusinessUnitId.ToString();
			this.lblUserId.Text = loggedInUser.CrmUserId.ToString();
			this.lblFullName.Text = loggedInUser.FullName;
			this.lblAccountId.Text = loggedInUser.AccountId.ToString();
		}
	}
}