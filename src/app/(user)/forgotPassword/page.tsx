"use client";

import { Box, Button, Card, Flex, Heading, Separator, Spinner, Text, TextField } from "@radix-ui/themes";
import Form from 'next/form';
import { useActionState, useEffect, useState } from "react";
import { handleForgotPassword, handleResetPassword } from "./actions";
import { toast } from "react-toastify";

export default function SigninPage() {
  const [forgotPasswordState, forgotPasswordAction, isForgotPasswordPending] = useActionState(handleForgotPassword, null);
  const [resetPasswordState, resetPasswordAction, isResetPasswordPending] = useActionState(handleResetPassword, null);

  const [pageState, setPageState] = useState(0);

  useEffect(() => {
    if (forgotPasswordState) {
      const toastType = forgotPasswordState.success ? "success" : "error";
      toast(forgotPasswordState.message, { type: toastType });

      if (forgotPasswordState.success)
        setPageState(1);
    }
  }, [forgotPasswordState]);

  useEffect(() => {
    if (resetPasswordState) {
      const toastType = forgotPasswordState.success ? "success" : "error";
      toast(forgotPasswordState.message, { type: toastType });

      if (forgotPasswordState.success)
        window.location.href = '/';

      setPageState(0);
    }
  }, [resetPasswordState]);

  return (
    <Flex height="100vh" width="100vw" align="center" justify="center">
      <Box asChild={true} maxWidth="20%" width="20%">
        <Card size="4">
          <Flex direction="column" gap="3" width="100%">
            <Heading as="h1">Forgot Password</Heading>
            <Separator size="4" />
            {pageState == 0 && (
              <Form action={forgotPasswordAction}>
                <Flex direction="column" gap="3" width="100%">
                  <Text size="2">Username or Email</Text>
                  <TextField.Root name="emailOrUsername" size="3" placeholder="john_doe or user@example.com" required>
                    <TextField.Slot>
                      <i className="bi bi-envelope-at-fill"></i>
                    </TextField.Slot>
                  </TextField.Root>
                  <Button type="submit" disabled={isForgotPasswordPending} variant={isForgotPasswordPending ? "classic" : "solid"}>
                    {isForgotPasswordPending && (<Spinner loading />)}
                    Ask for Password Reset
                  </Button>
                </Flex>
              </Form>
            )}
            {pageState == 1 && (
              <Form action={resetPasswordAction}>
                <Flex direction="column" gap="3" width="100%">
                  <Text size="2">Token</Text>
                  <TextField.Root name="token" type="password" size="3" placeholder="super secret token" required>
                    <TextField.Slot>
                      <i className="bi bi-lock-fill"></i>
                    </TextField.Slot>
                  </TextField.Root>
                  <Text size="2">New Password</Text>
                  <TextField.Root name="password" type="password" size="3" placeholder="super secret password" required>
                    <TextField.Slot>
                      <i className="bi bi-lock-fill"></i>
                    </TextField.Slot>
                  </TextField.Root>
                  <Text size="2">Confirm Password</Text>
                  <TextField.Root name="confirmPassword" type="password" size="3" placeholder="super secret password again..." required>
                    <TextField.Slot>
                      <i className="bi bi-lock-fill"></i>
                    </TextField.Slot>
                  </TextField.Root>
                  <Button type="submit" disabled={isResetPasswordPending} variant={isResetPasswordPending ? "classic" : "solid"}>
                    {isResetPasswordPending && (<Spinner loading />)}
                    Reset Password
                  </Button>
                </Flex>
              </Form>
            )}
          </Flex>
          <Button variant="outline" style={{ width: "100%", marginTop: "1rem" }}>
            <a href="/">Back to Home</a>
          </Button>
        </Card>
      </Box>
    </Flex>
  );
}