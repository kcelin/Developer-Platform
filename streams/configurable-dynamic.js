"use strict";
// trigger the debugger so that you can easily set breakpoints
debugger;

var VectorWatch = require('vectorwatch-sdk');

var vectorWatch = new VectorWatch();

var logger = vectorWatch.logger;

vectorWatch.on('config', function(event, response) {
    // your stream was just dragged onto a watch face
    logger.info('on config');

    var what = response.createGridList('What');
    what.setHint('What would you like to say?');
    what.addOption('Hello');
    what.addOption('Bonjour');
    what.addOption('Hola');

    var who = response.createAutocomplete('Who');
    who.setHint('To whom?');
    who.setDynamic(true);

    response.send();
});

vectorWatch.on('options', function(event, response) {
    // dynamic options for a specific setting name was requested
    logger.info('on options');
    var settings = event.getUserSettings().settings;
    
    switch(event.req.body.settingName) {
        case 'Who':
            switch(settings['What'].name) {
                case 'Hello':
                    response.addOption('Friend');
                    response.addOption('Vector');
                    response.addOption('World');
                    break;
                case 'Bonjour':
                    response.addOption('Mon Ami');
                    response.addOption('Vector');
                    response.addOption('Le Monde');
                    break;
                case 'Hola':
                    response.addOption('Amigo');
                    response.addOption('Vector');
                    response.addOption('Mundo');
                    break;
            }
            break;
    }

    response.send();
});

vectorWatch.on('subscribe', function(event, response) {
    // your stream was added to a watch face
    logger.info('on subscribe');

    var settings = event.getUserSettings().settings;
    var streamText = settings['What'].name + ' ' + settings['Who'].name;

    response.setValue(streamText);

    response.send();
});

vectorWatch.on('unsubscribe', function(event, response) {
    // your stream was removed from a watch face
    logger.info('on unsubscribe');
    response.send();
});