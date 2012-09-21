/*
   Event Handler HOOKS and Implementations.
   
   =================================================================================================
   BEGIN EVENT HOOK & HANDLING USING JS
   =================================================================================================
   
   Demo showing how to implement Google API with oAuth.
   
   Disclaimer: The code below is just another Javascript Spaghetti code. To avoid such spaghetti code, please look into 
   something like backbone.js to make the actual App :)! 
 */


$(document).ready(function() {
	
	/* startApp after device ready */
	document.addEventListener("deviceready", startApp, false);
});


/**
 * Start the App
 */
function startApp() {
	
	var oAuth = liquid.helper.oauth;
	
    $("#access-code").click(function(event) {
        liquid.helper.oauth.authorize(authorizeWindowChange);
        event.preventDefault();
    });

    
    if (oAuth.isAuthorized()) {
    	/* Start Page TaskList */
    	startPageTaskList();
    }
}


function startPageTaskList() {
    $.mobile.changePage("#page-tasklist", {
        transition : "none",
    });
}



function authorizeWindowChange(uriLocation) {
    //console.log("Location Changed: " + uriLocation); 
	var oAuth = liquid.helper.oauth;
	
	// oAuth process is successful!	
    if (oAuth.requestStatus == oAuth.status.SUCCESS) {
        var authCode = oAuth.authCode;

        // have the authCode, now save the refreshToken and start Page TaskList
        oAuth.saveRefreshToken({ 
        	  	auth_code: oAuth.authCode
        	  }, function() {
        		  startPageTaskList();
        	  });
        
    } 
    else if (oAuth.requestStatus == oAuth.status.ERROR) 
    {
    	console.log("ERROR - status received = oAuth.status.ERROR");
    } 
    else {
        // do nothing, since user can be visiting different urls
    }
}


/**
 * Populates the list of Tasks
 */
function populateTaskList() {
	$.mobile.showPageLoadingMsg("a", "Loading Tasks...");
	
	/* hide all the request Info blocks/divs */
	$('.request-info').hide();
	
	liquid.model.tasks.getList(function(data) {
        $('#qt-listview-tasks').empty();
        
        console.log(JSON.stringify(data)); // debug JSON response data
        
        /* check if there's an error from server, then display
         * error and retry
         */
        if (data.error) {
        	console.log('Unable to load Task List >> ' + data.error.message);
        	$.mobile.hidePageLoadingMsg();   
            return;        	
        }
        
        /* if there are no elements in it, then
         * display the info message, and return */
        if (!data.items) {
        	$('#qt-listview-info').show();
            $.mobile.hidePageLoadingMsg();        	
            return;
        }
        
        
        for (var i = 0; i < data.items.length; i++) {
        	
        	var item = data.items[i];
        	
        	$('#qt-listview-tasks')
        		.append('<li><h5>' 
        					+ item.title +
        				'</h5></li>');
        }
        
        $('#qt-listview-tasks').listview('refresh');
        $.mobile.hidePageLoadingMsg();   
	});
}


function goHome() {
	
    $.mobile.changePage("#page-unauthorized", {
        transition : "none",
        reverse: false,
        changeHash: false
    });
    
}



(function() {

	$('#page-tasklist').live('pageshow', function(event) {
		
		if (!liquid.helper.oauth.isAuthorized()) {
			goHome();
			return;
		}
		
		$('#btn-refresh').click(function(event) {
			populateTaskList();
			event.preventDefault();
		});
		
		$('#btn-hide-error').click(function(event) {
			
			$('#qt-listview-error').hide();			
			event.preventDefault();
		});
		
		/* populateTaskList on page init */
		populateTaskList();
	
		/**
		 * Add the listeners for each of the components
		 * 	Listeners are for:
		 * - Title bar refresh btn (#head-menu-refresh)
		 */
		$('#head-menu-refresh').click(function(event) {
		    populateTaskList();
		    event.preventDefault();
		});
		
		
		$('#head-menu-signout').click(function(event) {
		    liquid.helper.oauth.unAuthorize();
		    goHome();
		    event.preventDefault();
		});
	
	});
})();