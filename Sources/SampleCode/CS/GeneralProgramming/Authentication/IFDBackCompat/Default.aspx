<%@ Assembly Name="IsvApplication1, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" %>

<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="IsvApplication.DefaultPage" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Untitled Page</title>
</head>
<body>
    <form runat="server">
    Current User:
    <asp:Label runat="server" ID="CurrentUserName" /><br />
    Entities:
    <asp:DropDownList ID="cmbEntities" runat="server">
    </asp:DropDownList>
    </form>
</body>
</html>
