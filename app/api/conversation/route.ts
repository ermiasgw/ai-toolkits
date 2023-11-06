import { auth } from "@clerk/nextjs";
import OpenAI from "openai";
import {NextResponse} from "next/server"
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export async function POST(req: Request ){
    try{
        const {userId} = auth();
        const body = await req.json();
        const { messages } = body;
        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if (!messages) {
            return new NextResponse("Messages are required", {status: 400});
        }

        const response = await openai.chat.completions.create({
            messages: messages,
            model: "gpt-3.5-turbo",
        });


        return NextResponse.json(response.choices[0].message.content)
        

    } catch(error){
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Interanal error", {status: 500});
    }
    
};