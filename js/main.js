// Main entry for the javascript classes.

(function(){
  var msgs = [];
  var init = function() {
    var loginBtn = document.getElementById('btn-login');
    loginBtn.onclick = messages.signIn;

    var logoutBtn = document.getElementById('btn-logout');
    logoutBtn.onclick = messages.signOut;

    var refreshBtn = document.getElementById('btn-refresh');
    refreshBtn.onclick = refreshMessages;

    var publishBtn = document.getElementById('btn-publish');
    publishBtn.onclick = publishMessage;
  }

  var updateMessages = function(result) {
    if (result.receivedMessages) {
      result.receivedMessages.forEach(function(message) {
        msgs.push(atob(message.message.data));
      });
    }

    var txt = document.getElementById('messages');
    txt.innerHTML = msgs.join('<br>');
  }

  var refreshMessages = function() {
    messages.getMessage('projects/msgs-sample/subscriptions/first-sub',
                        updateMessages);
  }

  var publishMessage = function() {
    var input = document.getElementById('input-msg').value;
    var msg = input.trim();
    if (msg.length > 0) {
      messages.publishMessage(
        'projects/msgs-sample/topics/my-first-topic',
        msg
      );
    }
  }
  document.addEventListener('DOMContentLoaded', init, false);

})();
