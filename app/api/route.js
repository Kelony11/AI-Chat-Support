import { NextResponse } from "next/server";
import OpenAI from "openai";

const system_prompt = `
Welcome to [Vrix Furniture]. Customer Service! I'm here to help you with anything you need. 🌟

How can I assist you today?
- **Order Inquiry:** Track your order or get details about shipments.
- **Product Information:** Ask me about our products, stock availability, or find the perfect item for your needs.
- **Technical Support:** Report an issue or get help with troubleshooting our products or services.
- **Feedback:** We love hearing from you! Tell us about your experience or suggest how we can improve.

Just type your question or choose an option from above, and I'll provide you with the information you need. If you need to speak to a human, type "Connect to agent," and I will transfer you to one of our team members. 🚀

What can I do for you today?
`;

export async function POST(req) {
    const openai = new OpenAI()
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: system_prompt,
            },
            ...data,
        ],

        model: 'gpt-4o-mini',
        stream: true 
    })


    const stream = new ReadableStream ({
        async start(controller) {
            const encoder = new TextEncoder()
            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content
                    if (content) {
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            } catch (err) {
                controller.error(err)
            } finally {
                controller.close()
            }
            
        },
    })

    return new NextResponse(stream)
}





