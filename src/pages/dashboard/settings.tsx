import DashboardLayout from "@/components/DashboardComponent";
import { useAuth } from "@/context/AuthContext";
import { handleChangePassword } from "@/modules/auth/authService";
import {
  Box,
  Button,
  Card,
  Flex,
  Separator,
  Spinner,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useState } from "react";
import { toast } from "react-toastify";

export default function DashboardSettings() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changePasswordPending, setChangePasswordPending] = useState(false);

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setChangePasswordPending(true);

      if (newPassword !== confirmNewPassword) {
        toast("Passwords do not match.", { type: "error" });
      } else {
        const response = await handleChangePassword({
          currentPassword,
          newPassword,
          confirmNewPassword,
        });

        if (!response.success) {
          toast(response.message, { type: "error" });
        } else {
          resetChangePasswordForm();
          toast(response.message, { type: "success" });
        }
      }
    } catch (error) {
      console.error(error);
      toast("An unkown error occurred. Please try again later.", {
        type: "error",
      });
    } finally {
      setChangePasswordPending(false);
    }
  };

  const resetChangePasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  return (
    <DashboardLayout>
      <Card style={{ width: "30%" }}>
        <Text size="4" weight="bold">
          Change Password
        </Text>
        <Separator size="4" mt="2" />
        <form onSubmit={(e) => handleChangePasswordSubmit(e)}>
          <Flex direction="column" gap="4" mt="2">
            <Box>
              <Text size="2">Current Password</Text>
              <TextField.Root
                name="currentPassword"
                size="2"
                type="password"
                placeholder="no longer super secret secret"
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              >
                <TextField.Slot>
                  <i className="bi bi-lock-fill"></i>
                </TextField.Slot>
              </TextField.Root>
            </Box>

            <Box>
              <Text size="2">New Password</Text>
              <TextField.Root
                name="newPassword"
                size="2"
                type="password"
                placeholder="new super secret secret"
                onChange={(e) => setNewPassword(e.target.value)}
                required
              >
                <TextField.Slot>
                  <i className="bi bi-lock-fill"></i>
                </TextField.Slot>
              </TextField.Root>
            </Box>
            <Box>
              <Text size="2">Confirm New Password</Text>
              <TextField.Root
                name="confirmNewPassword"
                size="2"
                type="password"
                placeholder="new super secret secret again..."
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              >
                <TextField.Slot>
                  <i className="bi bi-lock-fill"></i>
                </TextField.Slot>
              </TextField.Root>
            </Box>

            <Box>
              <Flex justify="end">
                <Button type="submit" size="2" disabled={changePasswordPending}>
                  {changePasswordPending ? (
                    <Spinner loading />
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </Flex>
            </Box>
          </Flex>
        </form>
      </Card>
    </DashboardLayout>
  );
}
