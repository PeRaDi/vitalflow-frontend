import {
  handleForgotPassword,
  handleResetPassword,
} from "@/modules/auth/authService";
import { CheckIcon } from "@radix-ui/react-icons";
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
import { useState } from "react";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tokenState, setTokenState] = useState("none");
  const [token, setToken] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      setPending(true);
      e.preventDefault();
      if (!password || !confirmPassword) {
        toast("Please enter a valid password", { type: "error" });
        return;
      }

      if (password !== confirmPassword) {
        console.log(password, confirmPassword);
        toast("Passwords do not match", { type: "error" });
        return;
      }

      if (!token) {
        toast("Please enter a valid token", { type: "error" });
        return;
      }
      const response = await handleResetPassword(
        emailOrUsername,
        token,
        password,
        confirmPassword
      );

      if (!response.success) {
        toast(response.message, { type: "error" });
        return;
      }

      toast("Password reset successfully", { type: "success" });
      router.push("/auth/signin");
    } catch (error) {
      console.error(error);
      toast("An unknown error occurred resetting password", { type: "error" });
    } finally {
      setPending(false);
    }
  };

  const handleSendToken = async () => {
    try {
      setTokenState("pending");
      if (!emailOrUsername) {
        setTokenState("none");
        toast("Please enter a valid email or username", { type: "error" });
        return;
      }

      const response = await handleForgotPassword(emailOrUsername);

      if (!response.success) {
        setTokenState("none");
        toast(response.message, { type: "error" });
        return;
      }

      setTokenState("sent");
      toast("Password reset token sent successfully", { type: "success" });
    } catch (error) {
      console.error(error);
      toast("An unknown error occurred sending token", { type: "error" });
      setTokenState("none");
    }
  };

  return (
    <Flex height="100vh" width="100vw" align="center" justify="center">
      <Box asChild={true} maxWidth="20%" width="20%">
        <Card size="4">
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="3" width="100%">
              <Heading as="h1">Forgot Password</Heading>
              <Separator size="4" />
              <Text size="2">Username or Email</Text>
              <Flex direction="row" width="100%" justify="between">
                <TextField.Root
                  name="emailOrUsername"
                  type="text"
                  placeholder="john_doe or user@example.com"
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  style={{ width: "80%" }}
                  disabled={tokenState !== "none"}
                  variant={tokenState !== "none" ? "classic" : "surface"}
                  required
                >
                  <TextField.Slot>
                    <i className="bi bi-envelope-at-fill"></i>
                  </TextField.Slot>
                </TextField.Root>
                <Button
                  disabled={tokenState !== "none"}
                  variant={tokenState !== "none" ? "classic" : "solid"}
                  style={{ width: "17%" }}
                  onClick={() => handleSendToken()}
                >
                  {tokenState === "sent" && <CheckIcon />}
                  {tokenState === "pending" && <Spinner loading />}
                  {tokenState === "none" && "Send"}
                </Button>
              </Flex>
              {tokenState === "sent" && (
                <>
                  <Separator size="4" />

                  <Text size="2">Password</Text>
                  <TextField.Root
                    name="password"
                    type="password"
                    placeholder="super secret secret"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  >
                    <TextField.Slot>
                      <i className="bi bi-lock-fill"></i>
                    </TextField.Slot>
                  </TextField.Root>

                  <Text size="2">Confirm Password</Text>
                  <TextField.Root
                    name="password"
                    type="password"
                    placeholder="super secret secret again..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  >
                    <TextField.Slot>
                      <i className="bi bi-lock-fill"></i>
                    </TextField.Slot>
                  </TextField.Root>

                  <Text size="2">Password Reset Token</Text>
                  <TextField.Root
                    name="password"
                    type="password"
                    placeholder="super secret token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                  >
                    <TextField.Slot>
                      <i className="bi bi-lock-fill"></i>
                    </TextField.Slot>
                  </TextField.Root>
                  <Button
                    type="submit"
                    variant={!pending ? "classic" : "solid"}
                    disabled={pending}
                  >
                    {pending ? <Spinner loading /> : "Reset Password"}
                  </Button>
                </>
              )}
            </Flex>
            <Separator size="4" mt="4" />
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
