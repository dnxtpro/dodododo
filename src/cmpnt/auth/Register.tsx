import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import AuthService from "../../services/auth.service";
import { Button } from "@/components/ui/button";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);

  const validateForm = () => {
    if (!username || username.length < 3 || username.length > 20) {
      setMessage("Username must be between 3 and 20 characters.");
      return false;
    }
    if (!email) {
      setMessage("Email is required.");
      return false;
    }
    if (!password || password.length < 6 || password.length > 40) {
      setMessage("Password must be between 6 and 40 characters.");
      return false;
    }
    setMessage(""); // Clear any previous messages
    return true;
  };

  const handleRegister = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      setSuccessful(false);
      return;
    }

    setMessage("");
    setSuccessful(false);

    try {
      const response = await AuthService.register(username, email, password);
      setMessage(response.data.message);
      setSuccessful(true);
    }catch (error: unknown) {
        // Type guard for error handling
        let resMessage = "An error occurred.";
  
        if (error instanceof Error) {
          resMessage = error.message; // Get the error message if it's an instance of Error
        } else if (typeof error === "object" && error !== null && "response" in error) {
          // Check if it has a response property
          const errResponse = (error as any).response; // Cast to any to access properties
          resMessage =
            (errResponse && errResponse.data && errResponse.data.message) ||
            "An unexpected error occurred.";
        }
      setMessage(resMessage);
      setSuccessful(false);
    }
  };

  return (
    <Card className="w-[350px] mx-auto p-5 mt-10">
      <div className="absolute -left-1 bot-1/2"><img src="path1-9.png" alt="" /></div>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Enter your credentials to create an account.</CardDescription>
      </CardHeader>
      <CardContent>
      <form onSubmit={handleRegister}>
        <div className="mb-4">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`mt-1 ${message.includes("Username") ? "border-red-500" : ""}`}
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-1 ${message.includes("Email") ? "border-red-500" : ""}`}
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`mt-1 ${message.includes("Password") ? "border-red-500" : ""}`}
          />
        </div>

        <Button type="submit" className="w-full">Sign Up</Button>

        {message && (
          <div className="mt-4">
            <div
              className={`p-2 rounded ${successful ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              role="alert"
            >
              {message}
            </div>
          </div>
        )}
      </form>
      </CardContent>
    </Card>
  );
};

export default Register;
