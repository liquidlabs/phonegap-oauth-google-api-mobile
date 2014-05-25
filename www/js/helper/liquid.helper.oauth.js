/**
 * @fileOverview OAuth Helper functions for google authorization.<br />
 * It is used to authenticate using OAuth from Google's Server.
 *
 * The following files should be included before this file:
 *
 * @requires cordova.js (Phonegap library)
 * @requires jquery.js (jquery library)
 * @requires gapi-client.min.js (google API JS Client)
 * @requires liquid.js (The Base library)
 *
 * Reference (Google OAuth Playground):
 * https://developers.google.com/oauthplayground/
 *
 * @author Abdullah Rubiyath
 * @since  1.0
 */


/**
 * Add Google OAuth Capabilities to the helper
 * property/attribute of liquid
 */
(/** @lends liquid.helper */function(helper) {

    helper.oauth = {

        /* the key for refresh Token in local Storage */
        tokenKey: 'refresh_token',

        /* stores the accessToken after retrieval from google server */
        accessToken : false,

        /* stores the Time when access token was last received from server */
        accessTokenTime: false,

        /* stores access Token's Expiry Limit. Uses 58 min. instead of 60 min. */
        accessTokenExpiryLimit: 58 * 60 * 1000,

        /* A temporary variable storing callback function */
        callbackFunc: false,

        /* config values for Google API (gapi) */
        gapiConfig: liquid.config.gapi,

        /* stores the error message when an error happens from google server */
        errorMessage: false,

        /**
         * Attempts to authorize user using OAuth
         * Opens up Another window where user allows access or denies it.
         *
         * @param {function} callBack passed (error, accessToken)
         */
        authorize: function(callBack)
        {
            var $this = helper.oauth;
            var gapiConfig = liquid.config.gapi;

            var authUri = gapiConfig.endpoint + '?'
            + 'scope=' + encodeURIComponent(gapiConfig.scope)
            + '&' + 'redirect_uri=' + encodeURIComponent(gapiConfig.redirect_uri)
            + '&' + 'response_type=' + encodeURIComponent(gapiConfig.response_type)
            + '&' + 'client_id=' + encodeURIComponent(gapiConfig.client_id)
            + '&' + 'state=' + encodeURIComponent(gapiConfig.state)
            + '&' + 'access_type=' + encodeURIComponent(gapiConfig.access_type)
            + '&' + 'approval_prompt=force'; // @TODO - check if we really need this param

            $this.callbackFunc = callBack;
            $this.requestStatus = $this.status.NOT_DETERMINED;

            // Now open new browser
            $this.authWindow = window.open(authUri, '_blank', 'location=true,toolbar=true');
            $($this.authWindow).on('loadstart', $this.onAuthUrlChange);
        },

        /* OAuth Successfully done */
        onAuthSuccess: function() {
            //console.log('Auth Success?');
        },

        /**
         * Invoked when the URL changes on OAuth authorization process
         *
         * Success URL Pattern:
         * "redirect_uri" + "?code=" [secret code val]
         *
         * Success Sample URL:
         * http://localhost/?code=4/WOpRLQfvvhHE0tuMUDDqnn76lCTT.8nXC4IebMEAUuJJVnL49Cc8AQGr8cQI
         *
         * Denied Access URL Pattern: "redirect_uri" + ?error=access_denied
         * Denied Access Sample: http://localhost/?error=access_denied
         *
         * @param event
         */
        onAuthUrlChange: function(e) {
            var $this = helper.oauth;
            var uriLocation = e.originalEvent.url;
            $this.authWindow.close();

            if(uriLocation.indexOf("code=") != -1) {
                var authCode = $this.getParameterByName("code", uriLocation);
                $this.getTokens(authCode);
            }
            else {
                var error = 'unknown';
                if(uriLocation.indexOf("error=") != -1)
                    error = $this.getParameterByName("error", uriLocation);
                $this.callbackFunc(error);
            }
        },


        /**
         * Gets the Refresh & Access tokens from authorization code. This method is only called internally,
         * and once, only after when authorization of Application happens.
         *
         * @param paramObj An Object containing authorization code
         * @param paramObj.auth_code The Authorization Code for getting Refresh Token
         *
         * @param {Function} callback callback function which is to be invoked after
         *                            successful retrieval of data from google's server
         *
         */
        getTokens: function(authCode) {
            var $this = helper.oauth;
            var gapiConfig = liquid.config.gapi;

            $.ajax({
                type: "POST",
                url: gapiConfig.endtoken,
                data: {
                    client_id    : gapiConfig.client_id,
                    client_secret: gapiConfig.client_secret,
                    code         : authCode,
                    redirect_uri : gapiConfig.redirect_uri,
                    grant_type   : gapiConfig.grantTypes.AUTHORIZE
                }
            })
            .done(function(data) {
                console.log("Tokens Received: " + JSON.stringify(data));

                $this.accessToken     = data.access_token;
                $this.accessTokenTime = (new Date()).getTime();
                $this.setRefreshToken(data.refresh_token);

                $this.callback(null, $this.accessToken);
            })
            .fail(function(xhr, textStatus) {
                console.log("Token request error ?? >>" + xhr.responseText);
                $this.callback(xhr.responseText);
            })
            .always(function() {
                //console.log("Token request complete");
            });
        },


        /**
         * This method should ONLY be called locally from within this class.
         * Returns the Refresh Token from the local database.
         *
         * @return {String} The refresh Token
         *
         */
        getRefreshToken: function() {
            var $this = helper.oauth;

            return window.localStorage.getItem($this.tokenKey);
        },

        /**
         * This method should ONLY be called locally from within this class.
         * Saves the Refresh Token to the local database.
         *
         */
        setRefreshToken: function(refreshToken) {
            var $this = helper.oauth;
            return window.localStorage.setItem($this.tokenKey, refreshToken);
        },

        /**
         * This method should ONLY be called locally from within this class.
         * Saves the access Token.
         *
         */
        setAccessToken: function(accessToken) {
            var $this = helper.oauth;
            $this.accessToken     = accessToken;
            $this.accessTokenTime = (new Date()).getTime();
        },

        /**
         * This method is invoked externally. It retrieves the Access Token by at first
         * checking if current access token has expired or not. If its not expired, it
         * simply returns that, otherwise, it gets the refresh Token from the local database
         * (by invoking getToken) and then connecting with Google's Server (using OAuth)
         * to get the Access Token.
         *
         * @param {Function} callback   A callBack function which is to be invoked after
         *                             data is retrieved from the google's server. The data
         *                             from google server is passed to callback as args.
         *
         */
        getAccessToken: function(callback) {
            var $this = helper.oauth;
            var gapiConfig = $this.gapiConfig;
            var currentTime = (new Date()).getTime();

            //     console.log("Current Access Token: " + $this.accessToken);

            /* check if current Token has not expired (still valid) */
            if ($this.accessToken && $this.accessToken != false &&
                currentTime < ($this.accessTokenTime + $this.accessTokenExpiryLimit)) {
                callback(null, $this.accessToken);
                return;
            }

            /* else, get the refreshToken from local storage and get a new access Token */
            var refreshToken = $this.getRefreshToken();

            $.ajax({
                type: "POST",
                url: gapiConfig.endtoken,
                data: {
                    client_id    : gapiConfig.client_id,
                    client_secret: gapiConfig.client_secret,
                    refresh_token: refreshToken,
                    grant_type   : gapiConfig.grantTypes.REFRESH,
                }
            })
            .done(function(data) {
                // We have a new access token
                $this.setAccessToken(data.access_token);
                callback(null, $this.accessToken);
            })
            .fail(function(xhr, textStatus) {
                console.log("Token request error ?? >>" + xhr.responseText);
                callback(xhr.responseText);

            })
            .always(function() { //console.log("Token request complete");
            });
        },


        /**
         * Checks if user has authorized the App or not
         * It does so by checking if there's a refresh_token
         * available on the current database table.
         *
         * @return {Boolean} true if authorized, false otherwise
         */
        isAuthorized: function() {
            var $this = helper.oauth;
            var tokenValue = window.localStorage.getItem($this.tokenKey);

            //console.log("Refresh Token Value >>" + tokenValue);

            return ((tokenValue !== null) && (typeof tokenValue !== 'undefined'));
        },



        /**
         * Extracts the code from the url. Copied from online
         * @TODO needs to be simplified.
         *
         * @param name The parameter whose value is to be grabbed from url
         * @param url  The url to be grabbed from.
         *
         * @return Returns the Value corresponding to the name passed
         */
        getParameterByName: function(name, url) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(url);

            if(results == null) {
                return false;
            }
            else
                return decodeURIComponent(results[1].replace(/\+/g, " "));
        },
    };
})(window.liquid.helper);
