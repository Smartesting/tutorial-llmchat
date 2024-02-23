import { Elysia } from "elysia";
import OpenAI from 'openai'
import MistralClient from '@mistralai/mistralai'
import Stream from "@elysiajs/stream";

type Message = {
    role: "system" | "user" | "assistant";
    message: string;
};
type Conversation = Message[];

const openai = new OpenAI({
    apiKey: Bun.env.OPENAI_API_KEY
})
const mistral = new MistralClient(Bun.env.MISTRALAI_API_KEY)
const systemMessage: Message = {
    role: 'system',
    message: "You are a helpful assistant, provide answsers to the user's questions to the best of your ability. " +
        "Refrein from inventing knowledge, people are counting on you. "
}

const indexPlugin = new Elysia()
    .state('conversation', [systemMessage] as Conversation)
    .get('/', ({ store }) => {
        store.conversation = [systemMessage] as Conversation;
        return Bun.file('views/index.html');
    })


const streamPlugin = new Elysia()
    .state('stream', new Stream<string>())
    .get('/chat/stream', ({ store }) => {
        store.stream = new Stream<string>()
        return store.stream
    })

const app = new Elysia()
    .use(indexPlugin)
    .use(streamPlugin)
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
