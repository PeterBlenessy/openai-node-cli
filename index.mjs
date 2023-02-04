import * as dotenv from "dotenv"; // See https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { Configuration, OpenAIApi } from "openai";
import Spinner from './spinner.mjs';

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

console.log("Ask your questions and the AI will respond");
const commands = {
    "quit": "ends the conversation",
    "clear": "clears conversation history",
    "help": "prints this list of commands"
};

const spinner = Spinner("horizontal");

const printCommands = () => {
    for (const [key, value] of Object.entries(commands)) console.log(`\t - ${key} \t ${value}`);
}
printCommands();

rl.prompt();

rl.on('line', (question) => {

    switch (question.toLowerCase()) {
        case '':
            console.log("Please enter a valid question.");
            return;

        case 'quit':
            return rl.close();

        case 'clear':
            chatHistory = "";
            return rl.prompt();

        case 'help':
            rl.pause();
            printCommands();
            return rl.prompt();                
    }

    chatHistory += "\nUSER: " + question + "\nAI: ";

    rl.pause();
    spinner.start();

    // Call OpenAI API
    openai.createCompletion({ ...aiOptions, prompt: chatHistory })
        .then(response => {
            spinner.stop();
            console.log("AI: " + response.data.choices[0].text.trim() + "\n");
            chatHistory += response.data.choices[0].text.trim();
            conversationLog.push({ time: new Date().getTime(), user: question, ai: response.data.choices[0].text.trim(), ...response.data.usage });
        }).catch(error => {
            console.error("Error: An unexpected error has occurred: ", error);
        }).finally(() => {
            spinner.stop();
            rl.prompt();
        });

}).on('close', () => {
    console.log("Goodbye!");
    process.exit(0);
});
