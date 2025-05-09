"use client";

import { useAuth } from "@/context/AuthContext";
import { handleVerifyToken } from "@/modules/auth/authService";
import { Box, Button, Card, Flex, Heading, Separator } from "@radix-ui/themes";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Home() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  if (window.localStorage.getItem("auth-status") === "signed-out") {
    signOut();
    window.localStorage.removeItem("auth-status");
    toast.error("You have been signed out.");
  }

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

  return (
    <Flex height="100vh" width="100vw" align="center" justify="center">
      <Box asChild={true} maxWidth="30%">
        <Card size="4">
          <Flex direction="column" gap="3" width="100%">
            <Heading as="h1">Authentication</Heading>
            <Separator size="4" />
            <Button>
              <a href="/auth/signup">Sign up</a>
            </Button>
            <Button>
              <a href="/auth/signin">Sign in</a>
            </Button>
          </Flex>
        </Card>
      </Box>
    </Flex>
  );
}
