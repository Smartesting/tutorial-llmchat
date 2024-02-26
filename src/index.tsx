import { Elysia, t } from "elysia";
import { staticPlugin } from '@elysiajs/static'
import { html } from '@elysiajs/html' 
import OpenAI from 'openai'
import MistralClient from '@mistralai/mistralai'
import Stream from "@elysiajs/stream";

type Message = {
    role: "system" | "user" | "assistant";
    content: string;
};
type Conversation = Message[];

const openai = new OpenAI({
    apiKey: Bun.env.OPENAI_API_KEY
})
const mistral = new MistralClient(Bun.env.MISTRALAI_API_KEY)
const systemMessage: Message = {
    role: 'system',
    content: "You are a helpful assistant, provide answers to the user's questions to the best of your ability. " +
        "Refrain from inventing knowledge, people are counting on you. "
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

const chatPlugin = new Elysia()
    .use(indexPlugin)
    .use(streamPlugin)
    .use(html())
    .derive(async () => {
        const llmMessageId = Date.now().toString()
        return { llmMessageId };
    })
    .onResponse(({ store, llmMessageId }) => {
        streamOpenAIResponse(store.stream, store.conversation, llmMessageId).then(
            (llmMessage) => store.conversation.push(llmMessage)
        )
    })
    .post('/chat', async ({ llmMessageId, store, set, body }) => {
        try {
            const userMessage: Message = { role: 'user', content: body.usermessage }
            store.conversation.push(userMessage)
            return <>
                       <div class="bg-blue-100 rounded p-2 whitespace-pre-wrap">{body.usermessage}</div>
                       <div class="bg-green-100 rounded p-2 whitespace-pre-wrap" id={llmMessageId} sse-swap={llmMessageId}></div>
                   </>
        } catch (error) {
            set['status'] = 500
            return 'An error occurred while processing your request.'
        }
    }, {
        body: t.Object({
            usermessage: t.String()
        })
    })

async function streamOpenAIResponse(sseStream: Stream<string>, conv: Conversation, assistantMessageId: string): Promise<Message> {
    const openaiStream = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: conv,
        stream: true,
    })
    let fullMessage = ''
    for await (const chunk of openaiStream) {
        const delta = chunk.choices[0]?.delta?.content || ''
        fullMessage += delta
        sseStream.event = assistantMessageId
        sseStream.send(fullMessage.replace(/(\r\n|\n|\r)/gm, "&#10;"))
    }
    return { role: 'assistant', content: fullMessage }
}

const app = new Elysia()
    .use(staticPlugin())
    .use(chatPlugin)
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
