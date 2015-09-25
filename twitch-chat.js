function startFarmer(){
  var seconds = 0
  var text = 'OSbury TriHard OSbury' 
  var chatspammer = setInterval(function() {
    seconds = seconds + 1;
    $('#chat_text_input').val(text);
    $('[class="button primary float-right send-chat-button"]').click();
  }, 30000);
}

function stopFarmer(){
  clearInterval(chatspammer);
}