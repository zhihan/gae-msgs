/** Messages using cloud pub/sub library. */

var messages = (function(){
  var clientId = '388468322983-72fd13eu4l5vad93ljef5a71s5ujpbch' +
    '.apps.googleusercontent.com';
  var pubsubScopes = [
    'https://www.googleapis.com/auth/pubsub',
		'https://www.googleapis.com/auth/cloud-platform'
  ].join(' ');

	var apiKey = 'AIzaSyBm2-1AaEqgq4UkGtZXt__3XGfSiBSA2-0';
  var pusub; // To be assigned by the init function.

  /** Initialize the module with auth2 and pubsub API. */
  var init = function() {
    gapi.client.setApiKey(apiKey);
    gapi.auth2.init({
      client_id: clientId,
      scope: pubsubScopes
    });
    gapi.client.load('pubsub').then(function(){
      pubsub = gapi.client.pubsub;
    });
  };

  /** List the number of subscriptions. */
  var listSubscriptions = function() {
    pubsub.projects.subscriptions.list(
      {"project": "projects/msgs-sample/topics/my-first-topic"}
    ).then(function(resp) {
      console.log(resp);
    });
  };

  /** Log a message to the console. */
  var logMessages = function(subscription) {
    pubsub.projects.subscriptions.pull(
      {'subscription': subscription,
       'returnImmediately': true,
       'maxMessages': 1}
    ).then(function(resp) {
      console.log(resp);
    });
  };

  /** Check the response and return if it is OK. */
  var checkResponse = function(resp) {
    if (resp.status != 200) {
      console.log('Error ' + resp);
      return false;
    }
    return true;
  }

  /** Create a subscription. */
  var createSubscription = function(topic) {
    var suffix = Date.now().toString();
    var name = 'projects/msgs-sample/subscriptions/sub-' + suffix;
    pubsub.projects.subscriptions.create(
      {'topic': topic,
       'name': name
      }
    ).then(function(resp){
      checkResponse(resp);
    });
    return name;
  }

  /** Delete the subscription. */
  var removeSubscription = function(subscription) {
    pubsub.projects.subscriptions.delete(
      {'subscription': subscription}
    ).then(function(resp){
      checkResponse(resp);
    });
  }

  /** Publish a message to the topic */
  var publishMessage = function(topic, data) {
    pubsub.projects.topics.publish({
      'topic': topic,
      'messages': [{'data': btoa(data)}]
    }).then(checkResponse);
  }

  /** Acknoledge receiption of the messages. */
  var acknowledgeIfNecessary = function(subscription, result) {
    if (result.receivedMessages) {
      result.receivedMessages.forEach(function(message) {
        pubsub.projects.subscriptions.acknowledge(
          {'subscription': subscription,
           'ackIds': [message.ackId]}
        ).then(checkResponse);
      });
    }
  };

  /**
    Get at most one message and calls the callback with result.

    Acknowledge if it successfully pulles an message.
   */
  var getMessage = function(subscription, callback) {
    pubsub.projects.subscriptions.pull(
      {'subscription': subscription,
       'returnImmediately': true,
       'maxMessages': 1}
     ).then(function(resp) {
       if (checkResponse(resp)) {
         var result = resp.result;
         acknowledgeIfNecessary(subscription, result);
         callback(result);
       }
     });
    };

    // Public interface
    return {
		    init: init,
        signIn: function(){
          return gapi.auth2.getAuthInstance().signIn();
        },
        signOut: function(){
          return gapi.auth2.getAuthInstance().signOut();
        },
        logMessages: logMessages,
        getMessage: getMessage,
        publishMessage: publishMessage,
        createSubscription: createSubscription,
        removeSubscription: removeSubscription
	  };
})();


gapi.load('client:auth2', messages.init);
