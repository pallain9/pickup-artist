const Alexa = require('ask-sdk-core')
const axios = require('axios')
const skillBuilder = Alexa.SkillBuilders.custom();


async function getPickupLine() {
    const response = await axios.get(`http://pebble-pickup.herokuapp.com/tweets/random`)

    return response.data.tweet
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
    },
    handle(handlerInput) {
        const homeText = 'Need the perfect pickup line? you can say Yes or give me a pickup line! '
        const reprompt = 'I have tons of lines guaranteed to work!'

        return handlerInput.responseBuilder
            .speak(homeText + reprompt)
            .reprompt(reprompt)
            .withShouldEndSession(false)
            .getResponse()
    }
}

const PickupIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'PickupIntent'
    },
    async handle(handlerInput) {
        const pickupLine = await getPickupLine()
        const reprompt = 'Had enough?'
        const speak = `"${pickupLine}."`
        return handlerInput.responseBuilder
            .speak(speak)
            .reprompt(reprompt)
            .withShouldEndSession(false)
            .getResponse()
    },
}
const ExitIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest'
    },
    handle(handlerInput) {
        const exitText = "Come back soon to stay smooth!"

        return handlerInput.responseBuilder
            .speak(exitText)
            .withShouldEndSession(true)
            .getResponse()
    }
}
const CancelandStopIntentsHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent')
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('I guess you do not need my help! SAD!')
            .withShouldEndSession(true)
            .getResponse()
    }
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
    },
    handle(handlerInput) {
        const guidance = 'pickup line artist helps you to be a hit with your crush.  '
        const reprompt = 'Do you want a line?'

        return handlerInput.responseBuilder
            .speak(guidance + reprompt)
            .reprompt(reprompt)
            .withShouldEndSession(false)
            .getResponse()
    }
}

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === ''
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent'
    },
    handle(handlerInput) {
        const guidance = "I am sorry, I did not get that.  are you ready to be too smooth?"
        const reprompt = "I can help!"

        return handlerInput.responseBuilder
            .speak(guidance + reprompt)
            .reprompt(reprompt)
            .withShouldEndSession(false)
            .getResponse()
    }
}

const NavigateHomeIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NavigateHomeIntent'
    },
    handle(handlerInput) {
        const homeText = 'Need the perfect pickup line? you can say Yes or give me a pickup line'
        const reprompt = 'I have tons of lines guaranteed to work!'

        return handlerInput.responseBuilder
            .speak(homeText + reprompt)
            .reprompt(reprompt)
            .withShouldEndSession(false)
            .getResponse()
    }
}

const NoIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent'
    },
    handle(handlerInput) {
        const speechText = 'I see just by calling me you have learned my ways.  Comeback later!'

        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(true)
            .getResponse()
    },
}

const YesIntent = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent'
    },
    async handle(handlerInput) {
        const pickupLine = await getPickupLine()
        const reprompt = 'Want another?'
        const speak = `"${pickupLine}."`
        return handlerInput.responseBuilder
            .speak(speak)
            .reprompt(reprompt)
            .withShouldEndSession(false)
            .getResponse()
    },
}
const ErrorHandler = {
    canHandle() {
        return true
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('I am sorry, my wisdom is escaping me.  Try again later!')
            .withShouldEndSession(false)
    }
}
exports.handler = skillBuilder.addRequestHandlers(
    NavigateHomeIntentHandler,
    PickupIntentHandler,
    CancelandStopIntentsHandler,
    ExitIntentHandler,
    HelpIntentHandler,
    FallbackIntentHandler,
    LaunchRequestHandler,
    YesIntent,
    NoIntentHandler
)
    .addErrorHandler(ErrorHandler)
    .lambda()