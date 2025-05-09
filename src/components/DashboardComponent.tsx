"use client";

import withAuth from "@/components/hoc/withAuth";
import { useAuth } from "@/context/AuthContext";
import { handleSignout } from "@/modules/auth/authService";
import {
  ArchiveIcon,
  BoxModelIcon,
  GearIcon,
  HomeIcon,
  PersonIcon,
  TriangleUpIcon,
} from "@radix-ui/react-icons";
import {
  Avatar,
  Box,
  Card,
  DropdownMenu,
  Flex,
  IconButton,
  Separator,
  Text,
} from "@radix-ui/themes";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { toast } from "react-toastify";

function DashboardLayoutComponent({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const items = [
    {
      name: "Dashboard",
      href: "/dashboard/home",
      icon: HomeIcon,
      role: ["ADMIN", "MANAGER", "USER"],
    },
    {
      name: "Products",
      href: "/dashboard/products",
      icon: ArchiveIcon,
      role: ["MANAGER", "USER"],
    },
    {
      name: "Users",
      href: "/dashboard/users",
      icon: PersonIcon,
      role: ["ADMIN", "MANAGER"],
    },
    {
      name: "Institutions",
      href: "/dashboard/institutions",
      icon: BoxModelIcon,
      role: ["ADMIN"],
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: GearIcon,
      role: ["ADMIN", "MANAGER", "USER"],
    },
  ];

  const signOutAction = async () => {
    const response = await handleSignout();
    if (response.success) {
      await signOut();
      toast.success(response.message);
      router.push("/home");
    }
  };

  return user ? (
    <Flex height="100vh" width="100vw" align="center" justify="between" gap="3">
      <Box asChild={true} width="15vw" maxWidth="15vw" height="100%">
        <Card>
          <Box width="100%" height="7vh">
            <Card>
              <Flex gap="3" align="center">
                <Avatar size="3" radius="full" fallback="V" />
                <Box>
                  <Text as="div" size="2" weight="bold">
                    {user.role.displayName} Dashboard
                  </Text>
                  <Text as="div" size="2" color="gray">
                    vitalFlow
                  </Text>
                </Box>
              </Flex>
            </Card>
          </Box>
          <Box width="100%" height="85vh">
            <Fragment>
              {items.map((item, index) => {
                if (!item.role.includes(user.role.label)) return null;
                return (
                  <Flex width="100%" direction={"column"} key={index}>
                    <Card
                      onClick={() => {
                        router.push(item.href);
                      }}
                      size="2"
                      variant="ghost"
                      style={{
                        cursor: "pointer",
                        marginTop: "0vw",
                      }}
                    >
                      <Flex align="center" width="100%">
                        <IconButton>{item.icon && <item.icon />}</IconButton>
                        <Text as="div" style={{ marginLeft: "0.5vw" }}>
                          {item.name}
                        </Text>
                      </Flex>
                    </Card>
                  </Flex>
                );
              })}
            </Fragment>
          </Box>
          <Box width="100%" height="7vh">
            <Card>
              <Flex gap="3" align="center" justify="between">
                <Flex direction="row" gap="3" align="center">
                  <Avatar size="3" radius="full" fallback="V" />
                  <Flex direction="column">
                    <Text as="div" size="2" weight="bold">
                      {user.name}
                    </Text>
                    <Text as="div" size="2" color="gray">
                      {user.role.displayName}
                    </Text>
                  </Flex>
                </Flex>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <IconButton>
                      <TriangleUpIcon />
                    </IconButton>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Item
                      onSelect={() => router.push("/dashboard/profile")}
                    >
                      Profile
                    </DropdownMenu.Item>
                    <Separator size="4" />
                    <DropdownMenu.Item onSelect={() => signOutAction()}>
                      Signout
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Flex>
            </Card>
          </Box>
        </Card>
      </Box>
      <Box asChild={true} width="85vw" maxWidth="85vw" height="100%">
        <Card>
          <main>{children}</main>
        </Card>
      </Box>
    </Flex>
  ) : null;
}

const DashboardLayout = withAuth(DashboardLayoutComponent);
export default DashboardLayout;
