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
const rl = readline.createInterface({ input, output });

// Completion options
const aiOptions = { 
    model: "text-davinci-003",
    temperature: 0.5
};

const prompt = "Type your question ['quit' ends the conversation] \n";
let conversationLog = [];

rl.write(prompt);

rl.on('line', (question) => {

    // Input validation
    if (!question) {
        console.log("Please enter a valid question.");
        return;
    }

    // Check if the user wants to end the conversation
    if (question.toLowerCase() === "quit") {
        console.log("Goodbye!");
        return rl.close();
    }

    // Call OpenAI API
    openai.createCompletion({ ...aiOptions, prompt: question })
    .then( response => {
        console.log('Answer: ' + response.data.choices[0].text);
        conversationLog.push({ user: question, bot: response.data.choices[0].text });
    }).catch( error => {
        console.error("Error: An unexpected error has occurred: ", error.statusCode);
    }).finally(() => {
    });

});
