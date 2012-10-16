# How to independently use this library #

You can re-use this library to build your next app, which uses google's oauth to access their list of available API <http://code.google.com/apis/console>


## Required Files ##
You will need following core files for your project.
 * `liquid.js` (The Base library)
 * `helper/liquid.helper.oauth.js` (Google oauth2 helper library - depends on multiple files, it's highly recommended that you check inline documentation)

And following library files:
 * `cordova.js` (Cordova core library, required to use `localStorage` and childbrowser plugin)
 * `childbrowser.js` (cordova plugin which allows to open popup browser window without leaving your app)
 * `jquery.js` (jquery core library - required for AJAX calls)

### Optional Files ###
 * `gapi-client.min.js` (google API JS Client - only required IFF you plan to use this to simplify your life, otherwise you can just use plain-old-ajax-calls to get data)
 * `model/liquid.model.tasks.js` (This is an example "model" class, which uses GAPI client to access Google Tasks API)




Credits
---------------------------------------------------------------
Author: Abdullah Rubiyath, Hossain Khan
<br />
The code is licensed under MIT License.
<br />
Copyright (c) 2012 Liquid Labs Inc.
<http://liquidlabs.ca>