Implementing OAuth 2.0 with Google API in Cordova
------------------------------------------------------------------

 The code demonstrates how to implement OAuth 2.0 with Google API in Cordova with
 inappbrowser Plugin. Below are different screenshots of the App. The App authorizes 
 a Google Tasks API using OAuth 2.0 and then it accesses the User's Tasks and displays 
 them in a list view.

 ![AuthorizeView](http://liquidlabs.ca/wp-content/uploads/2012/09/gtask-demo-1-authorize.png "Authorize View - App first screen")
 ![AuthorizeGoogleLogin](http://liquidlabs.ca/wp-content/uploads/2012/09/gtask-demo-2-authorize-login.png "Authorize - Login to Google Service")
 ![AuthorizeAllowApp](http://liquidlabs.ca/wp-content/uploads/2012/09/gtask-demo-3-authorize-allow.png "Authorize - Allow App to access data")
 ![TaskListView](http://liquidlabs.ca/wp-content/uploads/2012/09/gtask-demo-4-authorized-tasklist.png "Task List View")

Trying the example with cordova cli on android
----------------------------------------------
    cordova platform add android
    cordova plugin add org.apache.cordova.inappbrowser
    cordova run

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
