import { sendMessage } from './whatsappAPI.js';

export async function handleIncomingMessage(data) {
    const phoneNumber = data.messages[0].from;
    const messageText = data.messages[0].text.body;

    let responseText = 'Hello! How can I help you?';  // Default response

    // Custom logic based on input message
    if (messageText.includes('hi')) {
        responseText = 'Hi there! How can I assist you?';
    } else if (messageText.includes('info')) {
        responseText = 'This is an AI-powered chatbot for answering queries.';
    }

    await sendMessage(phoneNumber, responseText);
}
