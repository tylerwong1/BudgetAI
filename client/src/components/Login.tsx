"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCheckSaveLogin } from "./UserPages/HandleUser";
import { apiRequest } from "@/api";
import { useState } from "react";

// Define the schema for validation using Zod
const formSchema = z.object({
  email: z.string(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export default function Login() {
  const navigate = useNavigate();
  const [loginSuccess, setloginSuccess] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (loginSuccess) {
    setloginSuccess(true);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    try {
      const request = await apiRequest("/user/login", "POST", values);
      console.log("Successfully Logged In!", request);
      setloginSuccess(true);
      localStorage.setItem("user", values.email);
      localStorage.setItem("isLoggedIn", "true");
      navigate("/home");
    } catch (e) {
      console.log("Error logging in...", e);
    }
  }

  return (
    <div className="content-holder">
      <h1>Log In</h1>
      <div className="content-card card">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="m-2">
              Submit
            </Button>
            <Link to="/signup">Don't have an account yet? Click here!</Link>
          </form>
        </Form>
      </div>
    </div>
  );
}
