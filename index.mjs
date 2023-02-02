import * as dotenv from 'dotenv'; // See https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { Configuration, OpenAIApi } from "openai";

// Load environment variables
dotenv.config();

// Configure OpenAI secrets
const configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

// Create the terminal input
const prompt = "USER: ";
const rl = readline.createInterface({ input, output, prompt });

// Completion options
const aiOptions = { 
    model: "text-davinci-003",
    temperature: 0.5,
    max_tokens: 2048,
    stop: ["\nUSER: ", "\nAI: "]
};

let conversationLog = [];
let chatHistory = "";

console.log("Type your question ['quit' ends the conversation] \n");

rl.prompt();

rl.on('line', (question) => {

    // Input validation
    if (!question) {
        console.log("Please enter a valid question.");
        return;
    }

    // Check if the user wants to end the conversation
    if (question.toLowerCase() === "quit") {
        return rl.close();
    }

    chatHistory += "\nUSER: " + question + "\nAI: ";

    // Call OpenAI API
    openai.createCompletion({ ...aiOptions, prompt: chatHistory })
    .then( response => {
        rl.pause();
        console.log("AI: " + response.data.choices[0].text.trim() + "\n");
        chatHistory += response.data.choices[0].text.trim();
        conversationLog.push({ time: new Date().getTime(), user: question, ai: response.data.choices[0].text.trim(), ...response.data.usage });
    }).catch( error => {
        console.error("Error: An unexpected error has occurred: ", error);
    }).finally(() => {
        rl.prompt();
    });

}).on('close', () => {
    console.log("Goodbye!");
    process.exit(0);
});
