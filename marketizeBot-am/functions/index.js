'use strict';

const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const { Carousel } = require('actions-on-google');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements


exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

//   function googleAssistantOther(agent) {
//     let conv = agent.conv(); // Get Actions on Google library conversation object
//     conv.ask('Please choose an item:'); // Use Actions on Google library to add responses
//     conv.ask(new Carousel({
//       title: 'Google Assistant',
//       items: {
//         'WorksWithGoogleAssistantItemKey': {
//           title: 'Works With the Google Assistant',
//           description: 'If you see this logo, you know it will work with the Google Assistant.',
//           image: {
//             url: imageUrl,
//             accessibilityText: 'Works With the Google Assistant logo',
//           },
//         },
//         'GoogleHomeItemKey': {
//           title: 'Google Home',
//           description: 'Google Home is a powerful speaker and voice Assistant.',
//           image: {
//             url: imageUrl2,
//             accessibilityText: 'Google Home'
//           },
//         },
//       },
//     }));
//     // Add Actions on Google library responses to your agent's response
//     agent.add(conv);
//   }

    function ajuda (agent) {
        const ajudaTema = agent.parameters['Help'];
        switch(ajudaTema) {
            case "Criar": {
                agent.add('Para criar uma lista de compras, apenas digite "Criar lista [nome da lista]" e eu te direi os próximos passos!');
                break;
            }
            case "Procurar": {
                agent.add('Para procurar os mercados mais próximos vc já tem que ter uma lista criada, caso tenha apenas digite "procurar [nome da lista]" ');
                break;
            }
            case "Editar": {
                agent.add('Para editar os produtos de uma lista existente, apenas digite "editar [nome da lista]" ');
                break;
            }

            case "Excluir": {
                agent.add('Para exluir uma lista é simples! Apenas digite "Excluir [nome da lista] "');
                break;
            }

            default: {
                agent.add('Vc pode pedir ajuda sobre criar listas, procurar mercados, editar ou excluir listas comigo! apenas digite "Ajuda [tema da ajuda]" ');
                break;
            }
        }

        // agent.add(new Card({
        //     title: `Title: this is a card title`,
        //     imageUrl: imageUrl,
        //     text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
        //     buttonText: 'This is a button',
        //     buttonUrl: linkUrl
        // }));
        // agent.add(new Suggestion(`Quick Reply`));
        // agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
    }

    // app.intent('choose.value', (conv, {val}) => {
    //     switch( val ){
    //       case 'red':
    //         agent.add('I like red too!');
    //         break;
    //       case 'blue':
    //         agent.add('Blue is pretty cool!');
    //         break;
    //       default:
    //         agent.add(`Not sure what to say about ${val}.`);
    //     }
    //   })

    let intentMap = new Map();
    intentMap.set("Ajuda", ajuda);
    agent.handleRequest(intentMap);
});