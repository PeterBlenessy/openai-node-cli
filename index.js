require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const readline = require('readline');

const configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

// Create the terminal input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Define the model
const model = "text-davinci-003";
const prompt = "What is your question? ['quit' ends the conversation] \n";
let conversationLog = [];

const handleQuestion = (question) => {

    // Input validation
    if (!question) {
        console.log("Please enter a valid question.");
        return rl.question(prompt, handleQuestion);
    }

    // Check if the user wants to end the conversation
    if (question.toLowerCase() === "quit") {
        console.log("Goodbye!");
        return rl.close();
    }

    openai.createCompletion({
        model: model,
        prompt: question
    }).then(response => {
        console.log(response.data.choices[0].text);
        conversationLog.push({ user: question, bot: response.choices[0].text });
        rl.question(prompt, handleQuestion);
    }).catch(error => {
        // Handle rate limit error
        if (error.statusCode === 429) {
            console.log("Error: You have exceeded the rate limit. Please wait and try again later.");
        } else {
            console.log("Error: An unexpected error has occurred: ", error.statusCode);
        }
        return rl.close();
    });
}

rl.question(prompt, handleQuestion);
//console.log("Conversation Log : ", conversationLog);
