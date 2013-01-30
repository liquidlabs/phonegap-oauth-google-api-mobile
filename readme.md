Implementing OAuth 2.0 with Google API in Phonegap / ChildBrowser
------------------------------------------------------------------

 The code demonstrates how to implement OAuth 2.0 with Google API in Phonegap with
 ChildBrowser Plugin. Below are different screenshots of the App. The App authorize 
 a Google Tasks API using OAuth 2.0 and then it accesses the User's Tasks and displays 
 them in a list view.

 ![AuthorizeView](http://liquidlabs.ca/wp-content/uploads/2012/09/gtask-demo-1-authorize.png "Authorize View - App first screen")
 ![AuthorizeGoogleLogin](http://liquidlabs.ca/wp-content/uploads/2012/09/gtask-demo-2-authorize-login.png "Authorize - Login to Google Service")
 ![AuthorizeAllowApp](http://liquidlabs.ca/wp-content/uploads/2012/09/gtask-demo-3-authorize-allow.png "Authorize - Allow App to access data")
 ![TaskListView](http://liquidlabs.ca/wp-content/uploads/2012/09/gtask-demo-4-authorized-tasklist.png "Task List View")

Download and Install Demo App
----------------------------------------------------------------
You can download and install the App from Phonegap Build directly:
<br />
<https://build.phonegap.com/apps/209209>
<br />
*Note: You can also fork project, customize and then build your app using PhoneGap build system.*

 
Read Online Tutorial
---------------------------------------------------------------
The online tutorial explaining the code is posted at : <br />

<http://www.itsalif.info/content/oauth-google-api-gapi-phonegap-childbrowser-jquery>
 

Install Functional App from Play Store
---------------------------------------------------------------
You can also download fully functional TODO app, which uses Google's cloud based Tasks API. 
Currently we've released this only on Google Play store.

 ![PlayStoreQRCode](http://liquidlabs.ca/wp-content/uploads/2012/09/qtask-android-app-qrcode.png "Scan QR code with your Android Device") 
 <br />
[Quick Task on Google&trade; Play][PlayStoreLink]
  [PlayStoreLink]: https://play.google.com/store/apps/details?id=ca.liquidlabs.quicktask



Known Issues
---------------------------------
 * Some users have reported that this app does not authorize on Windows Phone platform. It gives `invalid_grant` error during authorization process. It could be related with `localStorage` html5 data-store, but not confirmed yet. If you have already fixed this issue, please share the fix with us.



Credits
---------------------------------------------------------------

Author: Abdullah Rubiyath, Hossain Khan
<br />
The code is licensed under MIT License.
<br />
Copyright (c) 2012 Liquid Labs Inc.