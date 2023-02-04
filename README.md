# A very simple ChatGPT-like CLI written in JavaScript

# Features

- [x] OpenAI text completion using text-davinci-003
- [x] Conversation history - in-memory
- [x] Clear conversation history - full
- [ ] Persistent conversation history - file based
- [ ] Avoid exceeding max_tokens limit for conversation history
- [ ] Selectable conversation history depth - command + depth

# Getting started

Start by copying `.env.example` to `.env` and add your `OPENAI_API_KEY` and optional `OPENAI_ORG`.
Then, in the terminal, run:

```shell
yarn install
yarn start
```

# Pass commands to the script during a conversation.

```shell
    quit    ends the conversation
    clear   clears conversation history
    help    prints this list of commands
```
