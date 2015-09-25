var GLOBAL = {
	chatSpammer : [],
	numActivesInterval : 0
}

function startSpammer(text,seconds){
	var secondsInterval = seconds*1000;
	var string = text;
	GLOBAL.chatSpammer.push({inverval:setInterval(function() {
		$('#chat_text_input').val(string);
		$('[class="button primary float-right send-chat-button"]').click();
	}, secondsInterval),intervalTitle:string});
	GLOBAL.numActivesInterval++;
}

function stopSpammer(index){
	clearInterval(GLOBAL.chatSpammer[index].inverval);
	GLOBAL.chatSpammer.pop(i);
	GLOBAL.numActivesInterval--;
}

function stopAllSpammers(){
	for(var i = 0; i < GLOBAL.numActivesInterval; i++){
		clearInterval(GLOBAL.chatSpammer[i].inverval);
	}
	GLOBAL.chatSpammer = [];
	GLOBAL.numActivesInterval = 0;
}

function listSpammers(){
	console.log('* List of Spammers Actives *');
	for(var i = 0; i < GLOBAL.numActivesInterval; i++){
		console.log((i+1)+') '+GLOBAL.chatSpammer[i].intervalTitle);
		console.log('_____________________________');
	}
}

function numberOfSpammers(){
	console.log('Number of spammers actives: ',GLOBAL.numActivesInterval);
}