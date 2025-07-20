"use client";

import withAuth from "@/components/hoc/withAuth";
import { useAuth } from "@/context/AuthContext";
import { handleSignout } from "@/modules/auth/authService";
import {
  ArchiveIcon,
  BoxModelIcon,
  ChevronLeftIcon,
  GearIcon,
  HamburgerMenuIcon,
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
  Tooltip,
} from "@radix-ui/themes";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { toast } from "react-toastify";

function DashboardLayoutComponent({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
      <Box
        asChild={true}
        width={isCollapsed ? "4vw" : "15vw"}
        maxWidth={isCollapsed ? "4vw" : "15vw"}
        height="100%"
        style={{ transition: "width 0.3s ease" }}
      >
        <Card>
          <Box width="100%" height="7vh">
            <Card
              variant={isCollapsed ? "ghost" : "classic"}
              mt={isCollapsed ? "4" : "0"}
            >
              <Flex
                gap="3"
                align="center"
                justify={isCollapsed ? "center" : "between"}
              >
                {!isCollapsed && (
                  <>
                    <Avatar size="3" radius="full" fallback="V" />
                    <Box style={{ flex: 1 }}>
                      <Text as="div" size="2" weight="bold">
                        {user.role.displayName} Dashboard
                      </Text>
                      <Text as="div" size="2" color="gray">
                        vitalFlow
                      </Text>
                    </Box>
                  </>
                )}
                <IconButton
                  size="2"
                  variant="ghost"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  style={{ cursor: "pointer" }}
                >
                  {isCollapsed ? <HamburgerMenuIcon /> : <ChevronLeftIcon />}
                </IconButton>
              </Flex>
            </Card>
          </Box>
          <Box width="100%" height="85vh">
            <Fragment>
              {items.map((item, index) => {
                if (!item.role.includes(user.role.label)) return null;
                return (
                  <Flex width="100%" direction={"column"} key={index}>
                    {isCollapsed ? (
                      <Tooltip content={item.name}>
                        <Card
                          onClick={() => {
                            router.push(item.href);
                          }}
                          variant="ghost"
                          mt="3"
                          style={{
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <IconButton size="2" variant="soft">
                            {item.icon && <item.icon />}
                          </IconButton>
                        </Card>
                      </Tooltip>
                    ) : (
                      <Card
                        onClick={() => {
                          router.push(item.href);
                        }}
                        size="2"
                        variant="ghost"
                        mt="3"
                        ml="2"
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <Flex align="center" width="100%">
                          <IconButton variant="soft">
                            {item.icon && <item.icon />}
                          </IconButton>
                          <Text as="div" ml={"3"}>
                            {item.name}
                          </Text>
                        </Flex>
                      </Card>
                    )}
                  </Flex>
                );
              })}
            </Fragment>
          </Box>
          <Box width="100%" height="7vh">
            <Card variant={isCollapsed ? "ghost" : "classic"}>
              <Flex align="center" justify={isCollapsed ? "center" : "between"}>
                {!isCollapsed && (
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
                )}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <IconButton variant="ghost" size="2">
                      {isCollapsed ? (
                        <Avatar
                          size="2"
                          radius="full"
                          variant="solid"
                          fallback="V"
                        />
                      ) : (
                        <TriangleUpIcon />
                      )}
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
      <Box
        asChild={true}
        width={isCollapsed ? "96vw" : "85vw"}
        maxWidth={isCollapsed ? "96vw" : "85vw"}
        height="100%"
        style={{ transition: "width 0.3s ease" }}
      >
        <Card>
          <main>{children}</main>
        </Card>
      </Box>
    </Flex>
  ) : null;
}

const DashboardLayout = withAuth(DashboardLayoutComponent);
export default DashboardLayout;
