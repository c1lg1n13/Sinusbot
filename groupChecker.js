registerPlugin({
    name: 'Group Checker',
    version: '0.1',
    backends: ['ts3'],
    description: 'Checks if user has a specified group, otherwise, it will notify him every X seconds',
    author: 'DrWarpMan',
    vars: [
        {
            name: 'pokeWithoutGroup_status',
            title: 'Enabled?',
            type: 'select',
            options: [
                "Yes",
                "No"
            ]
        },
        {   name: 'pokeWithoutGroup_type',
            title: 'Message Type',
            type: 'select',
            options: [
                "Poke",
                "Chat",
                "Both (Chat & Poke)"
            ],
            conditions: [
                { field: 'pokeWithoutGroup_status', value: 0 }
            ]
        },
        {
            name: 'pokeWithoutGroup_time',
            title: 'Time (in seconds), how often will the bot poke / message the user (every X seconds)',
            type: 'number',
            conditions: [
                { field: 'pokeWithoutGroup_status', value: 0 }
            ],
            placeholder: 120
        },
        {
            name: 'pokeWithoutGroup_message',
            title: 'Poke message',
            type: 'string',
            conditions: [
                { field: 'pokeWithoutGroup_status', value: 0 }
            ]
        },
        {
            name: 'pokeWithoutGroup_group',
            title: 'Group ID, that if user is not in, he will get poked',
            type: 'number',
            conditions: [
                { field: 'pokeWithoutGroup_status', value: 0 }
            ]
        }
    ]
}, function (sinusbot, config) {

    var engine = require('engine');
    var backend = require('backend');
    
    if(config.pokeWithoutGroup_status == 1) {
        engine.log("Not in Group Poker is disabled. Script won\'t start!");
        return;
    }

    if(config.pokeWithoutGroup_type == undefined)
        config.pokeWithoutGroup_type = 0;

    if(config.pokeWithoutGroup_group == undefined) {
        engine.log("Group is not defined! Script won\'t start!");
        return;
    }

    var pokerTime;
    var pokeMessage;
    var withoutGroup = config.pokeWithoutGroup_group.toString();

    if(config.pokeWithoutGroup_time == undefined) {
        engine.log("[Not in Group Poker] Time is undefined, changing to default - 120.");
        pokerTime = 120;
    } else if(config.pokeWithoutGroup_time < 1)
    {
        engine.log("[Not in Group Poker] Time is lower than number one, changing to default - 120.");
        pokerTime = 120;
    } else if(config.pokeWithoutGroup_time > 0)
    {
        pokerTime = config.pokeWithoutGroup_time * 1000;
    }

    if(config.pokeWithoutGroup_message)
        pokeMessage = config.pokeWithoutGroup_message;
    else pokeMessage = "";


    setInterval(function(){

        if(backend.isConnected()) {
        
            backend.getClients().forEach(
            
                function(client)
                {
                    if(!client.isSelf())
                    {
                        if(!hasServerGroupWithId(client, withoutGroup))
                        {
                            if(config.pokeWithoutGroup_type == 0)
                            {
                                client.poke(pokeMessage);
                            } else if(config.pokeWithoutGroup_type == 1)
                            {
                                client.chat(pokeMessage);
                            } else if(config.pokeWithoutGroup_type == 2)
                            {
                                client.chat(pokeMessage);
                                client.poke(pokeMessage);
                            }
                        }
                    }    
                }
    
            )
        
        };
    }, pokerTime);

	function hasServerGroupWithId(client, id){
	    return client.getServerGroups().some(function (group) {
	        return group.id() == id
	    })
	}
    
});