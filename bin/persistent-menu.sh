curl -X POST -H "Content-Type: application/json" -d '{ 
  "get_started":{
    "payload":"action?go"
  }
}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=$TOKEN"    

curl -X DELETE -H "Content-Type: application/json" -d '{
  "fields":[
    "persistent_menu"
  ]
}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=$TOKEN"    

curl -X POST -H "Content-Type: application/json" -d '{
	"persistent_menu": [{
		"locale": "default",
		"composer_input_disabled": false,
		"call_to_actions": [{
				"title": "Chercher un film",
				"type": "postback",
				"payload": "action?findMovie"
			},

			{
				"title": "Les films du moment",
				"type": "postback",
				"payload": "action?currentMovie"
			},

			{
				"title": "Listes",
				"type": "nested",
				"call_to_actions": [{
						"title": "Voir les listes",
						"type": "postback",
						"payload": "action?list"
					},
					{
						"title": "Ajouter une liste",
						"type": "postback",
						"payload": "action?addList"
					}
				]
			}

		]
	}]
}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=$TOKEN"