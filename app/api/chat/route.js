import { NextResponse } from "next/server"
import OpenAI from "openai";

const systemPrompt = ` Hello! I'm your virtual assistant, here to assist you with any questions or issues you might have regarding Vrix. Whether you're preparing for a crucial technical interview or need help navigating the platform, I'm dedicated to ensuring you have the best experience possible. Here's how I can support you:

Getting Started

Account Setup: Step-by-step guidance to create and verify your account.
Profile Customization: Tips on personalizing your profile to align with your interview goals.
Introduction to Features: An overview of key features and how to use them effectively.
Interview Practice

Starting a Practice Session: Instructions on initiating an AI-powered interview practice session.
Choosing Interview Topics: Advice on selecting the right technical topics for your practice.
Real-time Feedback: Understanding the feedback provided by the AI and tips on how to improve.
Technical Issues

Login Problems: Assistance with password resets, account recovery, and login errors.
Platform Navigation: Help with navigating the Vrix interface.
Audio/Video Issues: Troubleshooting common audio and video problems during practice sessions.
AI Response Accuracy: Reporting AI response issues and ensuring you receive accurate answers.
Subscription and Billing

Plan Details: Information on our subscription plans and their benefits.
Managing Your Subscription: Guidance on upgrading, downgrading, or canceling your subscription.
Billing Inquiries: Help with resolving billing issues, understanding charges, and accessing your payment history.
Feedback and Suggestions

Providing Feedback: Instructions on how to share your experience with Vrix.
Feature Requests: How to suggest new features or improvements for the platform.
Reporting Bugs: Steps to report any bugs or issues you encounter to our support team.
Additional Resources

Help Center: Access our comprehensive help articles and guides.
Community Forums: Engage with other users, share tips, and discuss interview strategies.
Support Contact: Information on how to reach our support team for further assistance.
`
    

export async function POST(req){
    const openai = new OpenAI()
    const data = await req.json()

    // step 1: completion
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: systemPrompt
            },
            ...data
        ],
        model: "gpt-4o-mini",
        stream: true
    })

    // step 2: stream the completion
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder(); // Converts text to Uint8Array
            try {
                for await (const chunk of completion) { // Wait for every chunk that the completion sends
                    const content = chunk.choices[0]?.delta?.content;
                    if (content) {
                        const text = encoder.encode(content);
                        controller.enqueue(text); // Send to controller after encoding
                    }
                }
            } catch (error) {
                controller.error(error);
            } finally {
                controller.close();
            }
        }
    });

    // return the stream
    return new NextResponse(stream);
}

















// import { NextResponse } from "next/server";
// import OpenAI from "openai";

// const system_prompt = `
// Welcome to [Vrix Furniture]. Customer Service! I'm here to help you with anything you need. 🌟

// How can I assist you today?
// - **Order Inquiry:** Track your order or get details about shipments.
// - **Product Information:** Ask me about our products, stock availability, or find the perfect item for your needs.
// - **Technical Support:** Report an issue or get help with troubleshooting our products or services.
// - **Feedback:** We love hearing from you! Tell us about your experience or suggest how we can improve.

// Just type your question or choose an option from above, and I'll provide you with the information you need. If you need to speak to a human, type "Connect to agent," and I will transfer you to one of our team members. 🚀

// What can I do for you today?
// `;

// export async function POST(req){
//     const openai = new OpenAI()
//     const data = await req.json()

//     // step 1: completion
//     const completion = await openai.chat.completions.create({
//         messages: [
//             {
//                 role: "system",
//                 content: systemPrompt
//             },
//             ...data
//         ],
//         model: "gpt-4o-mini",
//         stream: true
//     })

//     // step 2: stream the completion
//     const stream = new ReadableStream({
//         async start(controller) {
//             const encoder = new TextEncoder(); // Converts text to Uint8Array
//             try {
//                 for await (const chunk of completion) { // Wait for every chunk that the completion sends
//                     const content = chunk.choices[0]?.delta?.content;
//                     if (content) {
//                         const text = encoder.encode(content);
//                         controller.enqueue(text); // Send to controller after encoding
//                     }
//                 }
//             } catch (error) {
//                 controller.error(error);
//             } finally {
//                 controller.close();
//             }
//         }
//     });

//     // return the stream
//     return new NextResponse(stream);
// }