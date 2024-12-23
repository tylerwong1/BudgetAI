import { useState, useEffect } from "react";
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
import { apiRequest } from "../api";

// Define the schema for validation using Zod
const formSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Username must be at least 2 characters." })
      .max(50, { message: "Username must not exceed 50 characters." }),

    email: z.string().email({ message: "Invalid email address." }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),

    confirmPassword: z.string(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    const upperCaseRegex = /.*[A-Z].*/;
    const lowerCaseRegex = /.*[a-z].*/;
    const numberRegex = /.*[0-9].*/;
    const specialCharRegex = /.*[^a-zA-Z0-9].*/;
    if (
      !upperCaseRegex.test(password) ||
      !lowerCaseRegex.test(password) ||
      !numberRegex.test(password) ||
      !specialCharRegex.test(password)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "The password does not have all required characters!",
        path: ["password"],
      });
    } else if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export default function SignUp() {
  useCheckSaveLogin();

  const [hasUpCase, setHasUpCase] = useState(false);
  const [hasLowCase, setHasLowCase] = useState(false);
  const [hasNum, setHasNum] = useState(false);
  const [hasSpecial, setHasSpecial] = useState(false);
  const [hasAllParts, setHasAllParts] = useState(false);
  const [isPasswordGood, setIsPasswordGood] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isPasswordGood) {
      alert("Password must meet the required criteria!");
      return;
    }
    console.log("Submitted values:\n", values);
    const { confirmPassword, ...userData } = values;

    // send POST request to backend to create user account
    const sendData = async () => {
      try {
        const response = await apiRequest("/user/signup", "POST", userData);
        console.log("User Successfully Signed Up!", response);
        localStorage.setItem("user", values.email);
        localStorage.setItem("isLoggedIn", "true");
        navigate("/upload");
      } catch (error) {
        console.error("Error during signup:", error);
        alert("An error occurred during signup. Please try again.");
      }
    };
    sendData();
  }

  const passwordWarden = form.watch("password");
  useEffect(() => {
    const password = form.getValues().password;
    const upperCaseRegex = /.*[A-Z].*/;
    const lowerCaseRegex = /.*[a-z].*/;
    const numberRegex = /.*[0-9].*/;
    const specialCharRegex = /.*[^a-zA-Z0-9].*/;

    // Temp vars because useState does not update until after useEffect is complete!
    const upTest = upperCaseRegex.test(password);
    const lowTest = lowerCaseRegex.test(password);
    const numberTest = numberRegex.test(password);
    const specialTest = specialCharRegex.test(password);

    setHasUpCase(upTest);
    setHasLowCase(lowTest);
    setHasNum(numberTest);
    setHasSpecial(specialTest);
    setHasAllParts(upTest && lowTest && numberTest && specialTest);
    setIsPasswordGood(
      upTest && lowTest && numberTest && specialTest && password.length > 7,
    );
  }, [passwordWarden, form]);

  return (
    <div className="content-holder">
      <h1>Sign Up</h1>

      {/* Password Helper - Shows if the password will be accepted! */}
      {isEditingPassword && (
        <div className="bg-input text-left card w-1/5 absolute bottom-50 left-20">
          {isPasswordGood ? (
            <h3 className="text-complete font-bold">
              That is a nice password!
            </h3>
          ) : (
            <div>
              <h2>Passwords must be:</h2>
              <ul>
                <li
                  className={
                    "text-" +
                    (form.getValues().password.length > 7
                      ? "complete"
                      : "destructive")
                  }
                >
                  At least 8 character long
                </li>
                <li
                  className={
                    "text-" + (hasAllParts ? "complete" : "destructive")
                  }
                >
                  {" "}
                  {hasAllParts
                    ? "has all character types covered"
                    : "Have a minimum include:"}
                  {!hasAllParts && (
                    <ul className="text-sm list-dot">
                      <li
                        className={
                          "text-" + (hasLowCase ? "complete" : "destructive")
                        }
                      >
                        A lower case letter
                      </li>
                      <li
                        className={
                          "text-" + (hasUpCase ? "complete" : "destructive")
                        }
                      >
                        A upper case letter
                      </li>
                      <li
                        className={
                          "text-" + (hasNum ? "complete" : "destructive")
                        }
                      >
                        A number
                      </li>
                      <li
                        className={
                          "text-" + (hasSpecial ? "complete" : "destructive")
                        }
                      >
                        A special character (like !, $, %, or ?)
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="content-card card">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="minimum 5 characters" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Used for user validation" {...field} />
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
                    <Input
                      placeholder="Min. 8 characters"
                      {...field}
                      onFocus={() => setIsEditingPassword(true)}
                      onBlur={() => setIsEditingPassword(false)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Password Again</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Making sure you know it 😉"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="m-2">
              Submit
            </Button>
            <Link to="/login">Already have an account? Click here!</Link>
          </form>
        </Form>
      </div>
    </div>
  );
}
