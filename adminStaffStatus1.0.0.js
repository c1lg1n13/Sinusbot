registerPlugin({
   
    name: 'adminStaffStatus',
    version: '1.0.0',
    description: 'Açık olan sunucu sahibi ve adminleri gösterir.',
    author: 'COSMOS',
   
    vars: [
{
    name: 'serverGroupsTC',
    title: 'Bilgi almak istediğiniz Sunucu gruplarını ekleyin.',
    type: 'array',
    vars: [
        {
            name: 'serverGroupID',
            title: 'Bilgi almak istediğiniz sunucu grubunun sunucu grup kimliğini girin.',
            indent: 1,
            type: 'string',
        },
        {
            name: 'countReplacer',
            title: '!adminCount! Sunucu grubundaki kaç kişinin çevrimiçi olduğunu sayı ile gösterir.',
            indent: 1,
            type: 'string',
        },
        {
            name: 'listReplacer',
            title: '!adminList! Sunucu grubundaki çevrimiçi kişileri listeler.',
            indent: 1,
            type: 'string'
        },
		{
            name: 'statusReplacer',
            title: '!adminStatus! Sunucu grubunun Çevrimiçi/Çevrimdışı olduğunu gösterir.',
            indent: 1,
            type: 'string'
        }
    ]
},
   
     {
    name: 'ignoreUsers',
    title: 'Kullanıcıları Yoksay (Göz ardı etmek istediğiniz kullanıcıların UID lerini girin)',
    type: 'multiline'
    },
    {
    name: 'Channel',
    title: 'Başlık Bilgileri / açıklama olarak ayarlamak istediğiniz kanal',
    type: 'channel'
    },
		        {
        name: 'coloration',
        title: 'Kanal açıklamasında "çevrimdışı" renkli kırmızı ve "çevrimiçi renkli yeşil" ister misiniz?',
        type: 'select',
        placeholder: 'EVET',
        options: [
        'EVET',
        'HAYIR'
        ]
    },
    {
        name: 'channelName',
        title: '!adminStatus! !adminCount! / kullanabilirsiniz)',
        type: 'string'
    },
    {
        name: 'channelDescription',
        title: '!adminStatus! !adminCount! !adminList! / kullanabilirsiniz)',
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
             offline = '[b][color=red] Çevrimdışı [/color]';
             online = '[b][color=green] Çevrimiçi [/color]';
        }
        else {
             offline = 'Çevrimdışı';
             online = 'Çevrimiçi';
        };
            var allUserCount = backend.getClients().length;                           //%allUserCount%
            /*-----------------------------------------------------------------------------------------------------------*/;
       if (backend.getChannelByID(config.Channel).name() != replaceChannelName(config.channelName)) {
			backend.getChannelByID(config.Channel).setName(replaceChannelName(config.channelName)),
			backend.getChannelByID(config.Channel).setTopic('[ .:DreamsGaming:. ]')
	   }
	   
	   if (backend.getChannelByID(config.Channel).description() != replaceDescription(config.channelDescription)) {
		 	backend.getChannelByID(config.Channel).setDescription(replaceDescription(config.channelDescription)),
			backend.getChannelByID(config.Channel).setTopic('[ .:DreamsGaming:. ]')  
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
