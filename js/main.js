// Main entry for the javascript classes.

(function(){
  var msgs = [];
  var topic = 'projects/msgs-sample/topics/my-first-topic';
  var subscription;

  var init = function() {
    var loginBtn = document.getElementById('btn-login');
    loginBtn.onclick = signIn;

    var logoutBtn = document.getElementById('btn-logout');
    logoutBtn.onclick = signOut;

    var refreshBtn = document.getElementById('btn-refresh');
    refreshBtn.onclick = refreshMessages;

    var publishBtn = document.getElementById('btn-publish');
    publishBtn.onclick = publishMessage;
  };

  var updateMessages = function(result) {
    if (result.receivedMessages) {
      result.receivedMessages.forEach(function(message) {
        msgs.push(atob(message.message.data));
      });
    }

    var txt = document.getElementById('messages');
    txt.innerHTML = msgs.join('<br>');
  };

  var refreshMessages = function() {
    messages.getMessage(subscription, updateMessages);
  };

  var publishMessage = function() {
    var input = document.getElementById('input-msg').value;
    var msg = input.trim();
    if (msg.length > 0) {
      messages.publishMessage(topic, msg);
    }
  };

  var signIn = function() {
    messages.signIn().then(function() {
      subscription = messages.createSubscription(topic);
    });
  };

  var signOut = function() {
    messages.removeSubscription(subscription);
    subscription = undefined;
    messages.signOut();
  };

  document.addEventListener('DOMContentLoaded', init, false);

})();
