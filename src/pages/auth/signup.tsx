import { useAuth } from "@/context/AuthContext";
import { handleSignup, handleVerifyToken } from "@/modules/auth/authService";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Separator,
  Spinner,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupToken, setSignupToken] = useState("");
  const [isPending, setIsPending] = useState(false);

  const { user, signOut } = useAuth();

  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      if (user) {
        const response = await handleVerifyToken();

        if (response.success) {
          router.push("/dashboard");
        } else {
          signOut();
        }
      }
    };

    verifyToken();
  }, [user, router, signOut]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    if (password !== confirmPassword) {
      setIsPending(false);
      return toast("Passwords do not match.", { type: "error" });
    }

    const response = await handleSignup({
      email,
      name,
      username,
      password,
      confirmPassword,
      signupToken,
    });

    setIsPending(false);

    console.log(response);

    toast(response.message, { type: response.success ? "success" : "error" });

    if (response.success) router.push("/auth/signin");
  };

  return (
    <Flex height="100vh" width="100vw" align="center" justify="center">
      <Box asChild={true} maxWidth="20%" width="20%">
        <Card size="4">
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="3" width="100%">
              <Heading as="h1">Sign up</Heading>
              <Separator size="4" />
              <Text size="2">Username</Text>
              <TextField.Root
                name="username"
                size="3"
                placeholder="john_doe"
                onChange={(e) => setUsername(e.target.value)}
                required
              >
                <TextField.Slot>
                  <i className="bi bi-person-fill"></i>
                </TextField.Slot>
              </TextField.Root>
              <Text size="2">Email</Text>
              <TextField.Root
                name="email"
                size="3"
                placeholder="john@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              >
                <TextField.Slot>
                  <i className="bi bi-envelope-at-fill"></i>
                </TextField.Slot>
              </TextField.Root>
              <Text size="2">Name</Text>
              <TextField.Root
                name="name"
                size="3"
                placeholder="John Doe"
                onChange={(e) => setName(e.target.value)}
                required
              >
                <TextField.Slot>
                  <i className="bi bi-person-fill"></i>
                </TextField.Slot>
              </TextField.Root>
              <Text size="2">Password</Text>
              <TextField.Root
                name="password"
                type="password"
                size="3"
                placeholder="super secret secret"
                onChange={(e) => setPassword(e.target.value)}
                required
              >
                <TextField.Slot>
                  <i className="bi bi-lock-fill"></i>
                </TextField.Slot>
              </TextField.Root>
              <Text size="2">Confirm Password</Text>
              <TextField.Root
                name="confirmPassword"
                type="password"
                size="3"
                placeholder="super secret secret again..."
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              >
                <TextField.Slot>
                  <i className="bi bi-lock-fill"></i>
                </TextField.Slot>
              </TextField.Root>
              <Text size="2">Token</Text>
              <TextField.Root
                name="signupToken"
                type="password"
                size="3"
                placeholder="super secret signup token"
                onChange={(e) => setSignupToken(e.target.value)}
                required
              >
                <TextField.Slot>
                  <i className="bi bi-lock-fill"></i>
                </TextField.Slot>
              </TextField.Root>
              <Button
                type="submit"
                disabled={isPending}
                variant={isPending ? "classic" : "solid"}
              >
                {isPending && <Spinner loading />}
                Sign up
              </Button>
              <Separator size="4" />
            </Flex>
          </form>
          <Button
            variant="outline"
            style={{ width: "100%", marginTop: "1rem" }}
          >
            <a href="/">Back to Home</a>
          </Button>
        </Card>
      </Box>
    </Flex>
  );
}
