'use strict';

const functions = require('firebase-functions');
const { WebhookClient, Card, Suggestion } = require('dialogflow-fulfillment');
const { dialogflow,
    BasicCard,
    BrowseCarousel,
    BrowseCarouselItem,
    Button,
    Carousel,
    Image,
    LinkOutSuggestion,
    List,
    MediaObject,
    Suggestions,
    SimpleResponse,} = require('actions-on-google');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements


exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    function ajuda (agent) {
        const ajudaTema = agent.parameters['Help'];
        let conv = agent.conv();
        switch(ajudaTema) {
            case "Criar": {
                conv.close('Para criar uma lista de compras, apenas digite "Criar lista [nome da lista]" e eu te direi os próximos passos!');
                break;
            }
            case "Procurar": {
                conv.close('Para procurar os mercados mais próximos vc já tem que ter uma lista criada, caso tenha apenas digite "procurar [nome da lista]" ');
                break;
            }
            case "Editar": {
                conv.close('Para editar os produtos de uma lista existente, apenas digite "editar [nome da lista]" ');
                break;
            }

            case "Excluir": {
                conv.close('Para exluir uma lista é simples! Apenas digite "Excluir [nome da lista] "');
                break;
            }

            default: {
                conv.close('Vc pode pedir ajuda sobre criar listas, procurar mercados, editar ou excluir listas comigo! apenas digite "Ajuda [tema da ajuda]" ');
                break;
            }
        }
    }

    // function mercadosProximos(agent) {
    //     let conv = agent.conv(); // Get Actions on Google library conversation 
    //     conv.ask('Selecione o mercado desejado:'); // Use Actions on Google library to add responses
    //     conv.ask(new Carousel({
    //         title: 'Google Assistant',
    //         items: {
    //             'WorksWithGoogleAssistantItemKey': {
    //             title: 'Carrefour Express - R$ 30,00',
    //             description: 'Mercado mais barato - 1.1km',
    //             image: {
    //                 url: 'https://upload.wikimedia.org/wikipedia/fr/thumb/0/09/Logo_carrefour_express.svg/280px-Logo_carrefour_express.svg.png',
    //                 accessibilityText: 'Carrefour Express',
    //             },
    //             },
    //             'GoogleHomeItemKey': {
    //             title: 'Pão de Açucar - R$ 38,40',
    //             description: 'Mercado mais próximo - 600m',
    //             image: {
    //                 url: 'https://upload.wikimedia.org/wikipedia/pt/d/dd/Logomarca_do_P%C3%A3o_de_A%C3%A7%C3%BAcar_%28supermercado%29.png',
    //                 accessibilityText: 'Pão de Açucar'
    //             },
    //             },
    //         },
    //     }));
    //      // Add Actions on Google library responses to your agent's response
    //     agent.add(conv);
    // }

    function mercadosProximos(agent) {
        let conv = agent.conv();
        conv.ask('Esses foram os resultados encontrados! Selecione um mercado para saber como chegar');
        conv.ask(new BrowseCarousel({
            items: [
              new BrowseCarouselItem({
                title: 'Carrefour Express - R$ 30,00',
                url: 'https://goo.gl/maps/R3HvxtY1XVz',
                description: 'Mercado mais barato - 1.1km',
                image: new Image({
                    url: 'https://upload.wikimedia.org/wikipedia/fr/thumb/0/09/Logo_carrefour_express.svg/280px-Logo_carrefour_express.svg.png',
                    alt: 'Carrefour Express',
                }),
              }),
              new BrowseCarouselItem({
                title: 'Pão de Açucar - R$ 38,40',
                url: "https://goo.gl/maps/5MYMEbZiQPT2",
                description: 'Mercado mais próximo - 600m',
                image: new Image({
                    url: 'https://upload.wikimedia.org/wikipedia/pt/d/dd/Logomarca_do_P%C3%A3o_de_A%C3%A7%C3%BAcar_%28supermercado%29.png',
                    alt: 'Pão de Açucar',
                }),
              }),
              new BrowseCarouselItem({
                title: 'Assaí - R$ 42,25',
                url: "https://goo.gl/maps/QmaZqR4nJMS2",
                description: 'Mercado mais próximo - 850m',
                image: new Image({
                    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Assai.svg/1200px-Assai.svg.png',
                    alt: 'Mercado Assaí',
                }),
              })
            ],
          }));
          agent.add(conv);
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
    intentMap.set("confirmacao-lista", mercadosProximos);
    agent.handleRequest(intentMap);
});
