"use server";

import { Message } from "@/components/Chat";
import { adminDb } from "@/firebaseAdmin";
import { generateLangchainCompletion } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";
// import { gerateLangchainCompletion } from "@/lib/langchain";

const PRO_LIMIT = 100;
const FREE_LIMIT = 2;
export async function askQuestion(id: string, q: string) {
  auth().protect();
  const { userId } = await auth();

  const chatRef = adminDb
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(id)
    .collection("chat");

  // check how many user messages are in the chat
  const chatSnapshot = await chatRef.get();
  const userMessages = chatSnapshot.docs.filter(
    (doc) => doc.data().role === "human"
  );

  // check membership limits for messages in a document
  const userRef = await adminDb.collection("users").doc(userId!).get();

  // tomorrow limit the PRO/FREE users

  // check if user is free tier and if they're have asked more than the FREE LIMIT questions
  if (!userRef.data()?.hasActiveMembership) {
    console.log("DEBUG 3", userMessages.length, FREE_LIMIT);
    if (userMessages.length >= FREE_LIMIT) {
      return {
        success: false,
        message: `You have reached your free limit. Upgrade your membership to Pro to ask more than ${FREE_LIMIT} questions.`,
      };
    }
  }

  // check if user is pro tier limit and if they're  over the file limitpage
  if (userRef.data()?.hasActiveMembership) {
    if (userMessages.length >= PRO_LIMIT) {
      console.log("Debug 4", userMessages.length, PRO_LIMIT);
      return {
        success: false,
        message: `You have reached your free limit. Upgrade your membership to Pro to ask more than ${PRO_LIMIT} questions.`,
      };
    }
  }

  const userMessage: Message = {
    role: "human",
    message: q,
    createdAt: new Date(),
  };

  await chatRef.add(userMessage);

  // gererate ai response
  const reply = await generateLangchainCompletion(id, q);

  const aiMessage: Message = {
    role: "ai",
    message: reply,
    createdAt: new Date(),
  };

  await chatRef.add(aiMessage);

  return {
    success: true,
    message: null,
  };
}
