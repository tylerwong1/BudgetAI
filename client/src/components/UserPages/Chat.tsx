"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import "@/styles/Upload.css";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCheckLoggedIn } from "./HandleUser";
import { apiRequest } from "@/api";

// Define the schema for validation using Zod
const messageSchema = z.object({
  message: z.string().min(1, { message: "Message cannot be empty" }),
});

interface Message {
  text: string;
  sender: "user" | "bot";
}

function Chat() {
  useCheckLoggedIn();
  const [messages, setMessages] = useState<Message[]>([]);

  // Use react-hook-form to handle the form state and validation
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  const handleSendMessage = async (values: z.infer<typeof messageSchema>) => {
    const userMessage: Message = {
      text: values.message,
      sender: "user",
    };

    const query = {
      query: values.message,
    };

    // Add the user's message to the chat immediately
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      // Send the user message to the backend
      console.log("message is sent!!!");
      const response = await apiRequest("/chat/prompt", "POST", query);

      const data = await response;

      // Create bot response from backend data
      const botResponse: Message = {
        text: data.response || "Sorry, I couldn't process that message.",
        sender: "bot",
      };

      // Add the bot's response to the chat
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        text: "There was an error. Please try again.",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    form.reset(); // Clear the input field after sending
  };

  return (
    <div className="content-holder">
      <h1>ChatBot</h1>
      <div className="content-card card">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
            </div>
          ))}
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSendMessage)}
            className="space-y-8 chat-input-form"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Type your message..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="m-2">
              Send
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Chat;
