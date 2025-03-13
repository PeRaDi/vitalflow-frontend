"use client";

import { useAuth } from "@/context/AuthContext";
import { handleSignin, handleVerifyToken } from "@/modules/auth/authService";
import { User } from "@/types/user";
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

export default function SigninPage() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const { user, signOut, signIn } = useAuth();

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

    const { success, message, data } = await handleSignin({
      emailOrUsername,
      password,
    });

    const user: User = data;
    setIsPending(false);

    if (success) {
      await signIn(user);
      router.push("/dashboard");
    }

    toast(message, { type: success ? "success" : "error" });
  };

  return (
    <Flex height="100vh" width="100vw" align="center" justify="center">
      <Box asChild={true} maxWidth="20%" width="20%">
        <Card size="4">
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="3" width="100%">
              <Heading as="h1">Sign in</Heading>
              <Separator size="4" />
              <Text size="2">Username or Email</Text>
              <TextField.Root
                name="emailOrUsername"
                size="3"
                placeholder="john_doe or user@example.com"
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
              >
                <TextField.Slot>
                  <i className="bi bi-envelope-at-fill"></i>
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
              <Text size="1">
                <a href="/auth/forgot-password">Forgot password?</a>
              </Text>
              <Button
                type="submit"
                disabled={isPending}
                variant={isPending ? "classic" : "solid"}
              >
                {isPending && <Spinner loading />}
                Sign in
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
