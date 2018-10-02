registerPlugin({
   
    name: 'adminStaffStatus',
    version: '1.0.0',
    description: 'Sets the online Admins or Moderators to channel name and or description.',
    author: 'Everlike <admin@everlike.de>',
   
    vars: [
{
    name: 'serverGroupsTC',
    title: 'Add Servergroups you want to get information from.',
    type: 'array',
    vars: [
        {
            name: 'serverGroupID',
            title: 'Enter a servergroup-ID of a servergroup you want to get information from.',
            indent: 1,
            type: 'string',
        },
        {
            name: 'countReplacer',
            title: 'The following word/characters will be replaced with the amount of online clients in the servergroup.',
            indent: 1,
            type: 'string',
        },
        {
            name: 'listReplacer',
            title: 'The following word/characters will be replaced with a list of online clients in the servergroup.',
            indent: 1,
            type: 'string'
        },
		{
            name: 'statusReplacer',
            title: 'The following word/characters will be replaced with the status of the group (online/offline)',
            indent: 1,
            type: 'string'
        }
    ]
},
   
     {
    name: 'ignoreUsers',
    title: 'Ignore Users (Enter UIDs of the users you want to ignore)',
    type: 'multiline'
    },
    {
    name: 'Channel',
    title: 'Channel you want to set the information as title/description',
    type: 'channel'
    },
		        {
        name: 'coloration',
        title: 'Do you want "offline" colored red and "online colored green in the channel description?',
        type: 'select',
        placeholder: 'yes',
        options: [
        'yes',
        'no'
        ]
    },
    {
        name: 'channelName',
        title: 'Enter the Channelname you want to set. (Here you can insert/use your placeholders)',
        type: 'string'
    },
    {
        name: 'channelDescription',
        title: 'Enter the Channel Description you want to set. (Here you can insers/use your placeholders)',
        type: 'multiline'
    }
]
}, function (sinusbot, config) {
 
    var engine = require ('engine');
    var backend = require('backend');
    var event = require ('event');
           
    event.on('clientMove', function(ev) {
       
	   if (config.ignoreUsers != undefined) {
		allClientsFiltered = backend.getClients().filter(function (client) {
	return config.ignoreUsers.indexOf(client.uid()) < 0;
		})
	   }
		else {
			allClientsFiltered = backend.getClients()
};
		
       
        if (config.coloration == 0) {
             offline = '[b][color=red] offline [/color]';
             online = '[b][color=green] online [/color]';
        }
        else {
             offline = 'offline';
             online = 'online';
        };
            var allUserCount = backend.getClients().length;                           //%allUserCount%
            /*-----------------------------------------------------------------------------------------------------------*/;
       if (backend.getChannelByID(config.Channel).name() != replaceChannelName(config.channelName)) {
			backend.getChannelByID(config.Channel).setName(replaceChannelName(config.channelName)),
			backend.getChannelByID(config.Channel).setTopic('made by Everlike <admin@everlike.de> ; everlike.de')
	   }
	   
	   if (backend.getChannelByID(config.Channel).description() != replaceDescription(config.channelDescription)) {
		 	backend.getChannelByID(config.Channel).setDescription(replaceDescription(config.channelDescription)),
			backend.getChannelByID(config.Channel).setTopic('made by Everlike <admin@everlike.de> ; everlike.de')  
	   }
    });
   
        /*The following 7 lines were made with help by Multivitamin -> https://gamers.wtf/ or https://forum.sinusbot.com/members/multivitamin.93/ */
function getClientsInGroup(grp) {
    grp = grp || '0000';
    return allClientsFiltered.filter(function (client) {
        return client.getServerGroups().some(function (group) {
            return grp.indexOf(group.id()) >= 0
        })
    })
};
 
function printUserNames(userList) {
	   userList.sort(function(a, b)
        {
            if (a.nick() < b.nick())
                return -1;
                
            if (a.nick() > b.nick())
                return 1;
                
            return 0;
        });
    var list = '';
    for (i = 0; i < userList.length; i++) {
        list += '[URL=client://' + userList[i].id() + '/' +  userList[i].uid() + ']' + userList[i].nick() + '[/URL]' +', ';
    }
    return list;
};
function replaceDescription(channelDescription) {
    for (var i = 0; i < config.serverGroupsTC.length; i++) {
        channelDescription = channelDescription.replace(config.serverGroupsTC[i].countReplacer, getClientsInGroup(config.serverGroupsTC[i].serverGroupID).length)
		channelDescription = channelDescription.replace(config.serverGroupsTC[i].listReplacer, printUserNames(getClientsInGroup(config.serverGroupsTC[i].serverGroupID)))
		channelDescription = channelDescription.replace(config.serverGroupsTC[i].statusReplacer, status(getClientsInGroup(config.serverGroupsTC[i].serverGroupID).length));
    }
    return channelDescription;
};
function replaceChannelName(channelName) {
	for (var i = 0; i < config.serverGroupsTC.length; i++) {
		channelName = channelName.replace(config.serverGroupsTC[i].countReplacer, getClientsInGroup(config.serverGroupsTC[i].serverGroupID).length)
	//	channelName = channelName.replace(config.serverGroupsTC[i].listReplacer, printUserNames(getClientsInGroup(config.serverGroupsTC[i].serverGroupID)))
		channelName = channelName.replace(config.serverGroupsTC[i].statusReplacer, statusChannelName(getClientsInGroup(config.serverGroupsTC[i].serverGroupID).length));
	}
	return channelName;
};

function status(clientList) {
	if (clientList > 0) {
		return online;
	}
	else {
	return offline;
	}
	
};
function statusChannelName(clientList) {
	if (clientList > 0) {
		return 'online';
	}
	else {
	return 'offline';
	}
};
});