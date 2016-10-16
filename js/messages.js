/** Messages using cloud pub/sub */

var messages = (function(){
    var clientId = '388468322983-72fd13eu4l5vad93ljef5a71s5ujpbch.apps.googleusercontent.com';
    var clientSecret = '5J4hsHo4paN8MRQZdLyRBrBw';
    var pubsubScopes = ['https://www.googleapis.com/auth/pubsub',
						            'https://www.googleapis.com/auth/cloud-platform'].join(' ');
	  var apiKey = 'AIzaSyBm2-1AaEqgq4UkGtZXt__3XGfSiBSA2-0';
    
	  /** Initialize the module with auth2 and pubsub API. */
	  var init = function() {
		    gapi.client.setApiKey(apiKey);
		    gapi.auth2.init({
			      client_id: clientId,
			      scope: pubsubScopes
		    });
        gapi.client.load('pubsub');
	  };
	  
    /** List the number of subscriptions. */
	  var listSubscriptions = function() {
		    gapi.client.pubsub.projects.subscriptions.list(
			      {"project": "projects/msgs-sample/topics/my-first-topic"}
		    ).then(function(resp) {
            console.log(resp);
        });		
	  };

    /** */
    var logMessages = function(subscription) {
        gapi.client.pubsub.projects.subscriptions.pull(
            {'subscription': subscription,
             'returnImmediately': true,
             'maxMessages': 1}
        ).then(function(resp) { console.log(resp); });
            
    };

    var checkedCallback = function(callback, resp) {
        if (resp.status == 200) {
            callback(resp.result);
        } else {
            console.log('Error');
        }
    };

    var checkResponse = function(resp) {
        if (resp.status != 200) {
            console.log('Error ' + resp);
        }
    }

    /** Acknoledge receiption of the messages. */
    var acknowledgeIfNecessary = function(subscription, result) {
        if (result.receivedMessages) {
            result.receivedMessages.forEach(function(message) {
                gapi.client.pubsub.projects.subscriptions.acknowledge(
                    {'subscription': subscription,
                     'ackIds': [message.ackId]}
                ).then(checkResponse);
            });
        }
    };
    
    var getMessage = function(subscription, callback) {
        gapi.client.pubsub.projects.subscriptions.pull(
            {'subscription': subscription,
             'returnImmediately': true,
             'maxMessages': 1}).then(function(resp) {
                 checkedCallback(
                     function(result){
                         acknowledgeIfNecessary(subscription, result);
                         callback(result);
                     }, resp)
             });
    };
    
	  return {
		    init: init,
        signIn: function(){ gapi.auth2.getAuthInstance().signIn(); },
        signOut: function(){ gapi.auth2.getAuthInstance().signOut(); },
        logMessages: logMessages,
        getMessage: getMessage
	  };
})();


gapi.load('client:auth2', messages.init);
