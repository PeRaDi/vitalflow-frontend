"use client";

import { Box, Button, Card, Flex, Heading, Separator, Spinner, Text, TextField } from "@radix-ui/themes";
import Form from 'next/form';
import { useActionState, useEffect } from "react";
import { handleSignin } from "./actions";
import { toast } from "react-toastify";

export default function SigninPage() {
  const [state, formAction, isPending] = useActionState(handleSignin, null);

  useEffect(() => {
    const toastType = state.success ? "success" : "error";
    toast(state.message, { type: toastType });

    if(state.success) {
      localStorage.setItem('token', state.data.token);
      window.location.href = '/dashboard';
    }
  }, [state]);

  return (
    <Flex height="100vh" width="100vw" align="center" justify="center">
      <Box asChild={true} maxWidth="20%" width="20%">
        <Card size="4">
          <Form action={formAction}>
            <Flex direction="column" gap="3" width="100%">
              <Heading as="h1">Sign in</Heading>
              <Separator size="4" />
              <Text size="2">Username or Email</Text>
              <TextField.Root name="emailOrUsername" size="3" placeholder="john_doe or user@example.com" required>
                <TextField.Slot>
                  <i className="bi bi-envelope-at-fill"></i>
                </TextField.Slot>
              </TextField.Root>
              <Text size="2">Password</Text>
              <TextField.Root name="password" type="password" size="3" placeholder="super secret secret" required>
                <TextField.Slot>
                  <i className="bi bi-lock-fill"></i>
                </TextField.Slot>
              </TextField.Root>
              <Button type="submit" disabled={isPending} variant={isPending ? "classic" : "solid"}>
                {isPending && (<Spinner loading />)}
                Sign in
              </Button>
              <Separator size="4" />
            </Flex>
          </Form>
          <Button variant="outline" style={{ width: "100%", marginTop: "1rem" }}>
            <a href="/">Back to Home</a>
          </Button>
        </Card>
      </Box>
    </Flex>
  );
}
