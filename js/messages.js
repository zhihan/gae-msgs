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
		}).then(function() {
			gapi.auth2.getAuthInstance().isSignedIn.listen(initPubsub)
			
			if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
				initPubsub();
			}
			gapi.auth2.getAuthInstance().signIn();
		});
	};

	var initPubsub = function() {
		gapi.client.load('pubsub').then(
			listSubscriptions
		);
	};
	

	var listSubscriptions = function() {
		gapi.client.pubsub.projects.subscriptions.list(
			{"project": "projects/msgs-sample/topics/my-first-topic"}
		).then(function(resp) { console.log(resp); })		
	};
	
	return {
		init: init
	};
})();


gapi.load('client:auth2', messages.init);
