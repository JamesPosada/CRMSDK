<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="ExternalCRM.Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    	Welcome&nbsp;
		<asp:Label ID="txtName" runat="server"></asp:Label>
    
    </div>
    <p>
		Your UPN is
		<asp:Label ID="lblUpn" runat="server"></asp:Label>
	</p>
	<p>
		Your CrmBusinessUnitId is
		<asp:Label ID="lblBizId" runat="server"></asp:Label>
	</p>
	<p>
		Your CrmUserId is&nbsp;
		<asp:Label ID="lblUserId" runat="server"></asp:Label>
	</p>
	<p>
		Your CRM Full Name is&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		<asp:Label ID="lblFullName" runat="server"></asp:Label>
	</p>
	<p>
		Account was created on behalf of you. AccountId =&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		<asp:Label ID="lblAccountId" runat="server"></asp:Label>
	</p>
    <p>
		&nbsp;</p>
    </form>
</body>
</html>
