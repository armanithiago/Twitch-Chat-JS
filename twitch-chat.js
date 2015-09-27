var GLOBAL = {
	chatSpammer : [],
	numActivesInterval : 0,
	firstTime : true
}

/* Chat Commands */

$('.chat-lines').on('DOMSubtreeModified', function(){
    if(GLOBAL.firstTime){
        var text = $('.chat-lines').find('.message').last().text().trim();
        var from = $('.chat-lines').find('.from').last().text().trim();
        verifyCommand(text,from);
        setTimeout(function() { GLOBAL.firstTime = true; }, 100);
    }
});

function verifyCommand(text,from){
    var command = text.split(' ');
    if(command[0] == "!isStreaming"){
    	GLOBAL.firstTime = false;
        getStream(command[1]);
    }else if(command[0] == "!inChat"){
    	GLOBAL.firstTime = false;
        getChatters(command[1],command[2],command[3]);
    }else if(command[0] == "!rapebot"){
    	GLOBAL.firstTime = false;
        callRapebot();
    }else if(command[2] == "subscribed!" && from == "twitchnotify"){
    	GLOBAL.firstTime = false;
        welcomeSub(command[0]);
    }else{
        return;
    }
}

function getStream(text){
    var testTrump = text;
    if(testTrump.toUpperCase() == 'TRUMPSC'){
        returnString = "/me Bot MrDestructoid : Tuck Frump!";
        $('#chat_text_input').val(returnString);
        setTimeout(function(){ $('.send-chat-button').click(); }, 500);
    }else{
        $.ajax({
            url:'https://api.twitch.tv/kraken/streams/'+text,
            success:function(data){
                if(data.stream == null){
                    $('#chat_text_input').val("/me Bot MrDestructoid : "+text+' is not streaming...');
                    setTimeout(function(){ $('.send-chat-button').click(); }, 500);
                }else{
                    var display_name = data.stream.channel.display_name;
                    var game = data.stream.game;
                    var viewers = data.stream.viewers;
                    var returnString = "/me MrDestructoid : "+display_name+" is online playing "+game+" with "+viewers+" viewers!";
                    $('#chat_text_input').val(returnString);
                    setTimeout(function(){ $('.send-chat-button').click(); }, 500);

                }
            },
            error:function(e){
                $('#chat_text_input').val("/me MrDestructoid : "+text+' don\'t exist...');
                setTimeout(function(){ $('.send-chat-button').click(); }, 500);
            }
        })  
    }
}

function getChatters(streamer,type,user){
    var name = streamer.toLowerCase();
    $.ajax({
        url: 'http://tmi.twitch.tv/group/user/'+name+'/chatters?',
        dataType: 'jsonp',
        success: function(json){
            var admins = json.data.chatters.admins.length;
            var staff = json.data.chatters.staff.length;
            var global_mods = json.data.chatters.global_mods.length;
            var moderators = json.data.chatters.moderators.length;
            var viewers = json.data.chatters.viewers.length;
            if(type == undefined){
                var returnString = "/me MrDestructoid : In "+streamer+"'s chat now has "+admins+" admin(s), "+staff+" staff(s), "+global_mods+" global_mod(s), "+moderators+" moderator(s) and "+viewers+" viewers(s).";  
                $('#chat_text_input').val(returnString);
                setTimeout(function(){ $('.send-chat-button').click(); }, 500);
            }else{
                var typeLower = type.toLowerCase();
                var exist = false;
                var valid = false;
                var returnString = '/me MrDestructoid : ';
                if(typeLower == 'admin'){
                    valid = true;
                    if(admins != 0){
                        exist = true;
                        returnString += nameInChatString(json.data.chatters.admins, admins, typeLower, name);
                    }                    
                }else if(typeLower == 'staff'){
                    valid = true;
                    if(staff != 0){
                        exist = true;
                        returnString += nameInChatString(json.data.chatters.staff, staff, typeLower, name);
                    }
                }else if(typeLower == 'global_mod'){
                    valid = true;
                    if(global_mods != 0){
                        exist = true;
                        returnString += nameInChatString(json.data.chatters.global_mods, global_mods, typeLower, name);
                    }
                }else if(typeLower == 'moderator'){
                    valid = true;
                    if(moderators != 0){
                        exist = true;
                        returnString += nameInChatString(json.data.chatters.moderators, moderators, typeLower, name);
                    }
                }else if(typeLower == 'viewer'){
                    valid = true;
                    if(viewers != 0){
                        exist = true;
                        returnString += nameInChatString(json.data.chatters.viewers, viewers, typeLower, name);
                    }
                }else if(typeLower == 'find'){
                    valid = true;
                    exist = true;
                    if(user == '' || user == undefined){
                        returnString += 'You need to put someone name.';
                    }else{
                        var username = user.toLowerCase();
                        var adminArray = json.data.chatters.admins;
                        var staffArray = json.data.chatters.staff;
                        var global_modArray = json.data.chatters.global_mods;
                        var moderatorArray = json.data.chatters.moderators;
                        var viewerArray = json.data.chatters.viewers;
                        if($.inArray(username,adminArray) > -1){
                            returnString += username+' is online as admin on '+streamer+'\'s chat.';
                        }else if($.inArray(username,staffArray) > -1){
                            returnString += username+' is online as staff on '+streamer+'\'s chat.';
                        }else if($.inArray(username,global_modArray) > -1){
                            returnString += username+' is online as global_mod on '+streamer+'\'s chat.';
                        }else if($.inArray(username,moderatorArray) > -1){
                            returnString += username+' is online as moderator on '+streamer+'\'s chat.';
                        }else if($.inArray(username,viewerArray) > -1){
                            returnString += username+' is online as viewer on '+streamer+'\'s chat.';
                        }else{
                            returnString += username+' is not in '+streamer+'\'s chat.';
                        }
                    }
                }

                if(!valid){
                    $('#chat_text_input').val("/me MrDestructoid : "+streamer+' don\'t exist...');
                    setTimeout(function(){ $('.send-chat-button').click(); }, 500);
                }
                if(!exist){
                    returnString += 'There are no '+typeLower+' in '+name+'\'s chat.';
                }
                $('#chat_text_input').val(returnString);
                setTimeout(function(){ $('.send-chat-button').click(); }, 500);                
            }
        },
        error:function(e){
            $('#chat_text_input').val("/me MrDestructoid : "+streamer+' don\'t exist...');
            setTimeout(function(){ $('.send-chat-button').click(); }, 500);
        }
    });
}

function nameInChatString(data, index, type, name){
    var returnString = '';
    for(var i = 0; i < index;i++){
        if(i == 0){
            returnString += 'The names of '+type+'(s) in '+name+'\'s chat: '+data[i];
        }else{
        	if(i < 20){
            	returnString += ', '+data[i];
            }else{
            	returnString += ' and more '+(index-30);
            	break;
            }

        }
    }
    return returnString;
}

function callRapebot(){
	var returnString = "/me MrDestructoid : ヽ༼ຈل͜ຈ༽ﾉ LETS MASTURBATE TOGETHERヽ༼ຈل͜ຈ༽ﾉ";
	$('#chat_text_input').val(returnString);
	setTimeout(function(){ $('.send-chat-button').click(); }, 500);
}

function welcomeSub(subName){
	var returnString = "/me MrDestructoid : ヽ༼ຈل͜ຈ༽ﾉ WHALE CUM "+subName+"!! ヽ༼ຈل͜ຈ༽ﾉ";
	$('#chat_text_input').val(returnString);
	setTimeout(function(){ $('.send-chat-button').click(); }, 500);
}


/* Spammer */

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
