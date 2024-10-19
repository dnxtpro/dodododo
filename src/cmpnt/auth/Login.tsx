import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

import AuthService from "../../services/auth.service";
import { Lock, User } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [redirect, setRedirect] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
    
    }
  }, []);

  useEffect(() => {
    if (redirect) {
      navigate(redirect);
    }
  }, [redirect, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!username || !password) {
      setMessage("Username and password are required.");
      setLoading(false);
      return;
    }

    try {
      await AuthService.login(username, password);
      setRedirect("/task");
    } catch (error) {
        let resMessage = "Something went wrong!";
        if (error instanceof Error) {
          resMessage = error.message;
        } else if (typeof error === "object" && error !== null) {
          const err = error as any; // Cast para acceder a posibles propiedades
          resMessage = err.response?.data?.message || err.toString();
        }
        setMessage(resMessage);
      setLoading(false);
    }
  };

  return (
    <Card className="w-[350px] mx-auto mt-10">
      <div className="absolute left-0 top-1/2r"><img src="path1-0.png" alt="" /></div>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>

      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-semibold">Username</Label>
            <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="pl-10"
              required
            />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
            <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              name="password"
              type="password"
              value={password}
              placeholder="Enter your password"
                className="pl-10"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            </div>
          </div>

          {message && (
            <Alert>
              <span>{message}</span>
            </Alert>
          )}
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Login;
