import { Box, Button, Card, Flex, Heading, Separator } from "@radix-ui/themes";

export default function Home() {
  return (
    <Flex height="100vh" width="100vw" align="center" justify="center">
      <Box asChild={true} maxWidth="30%">
        <Card size="4">
          <Flex direction="column" gap="3" width="100%">
            <Heading as="h1">Authentication</Heading>
            <Separator size="4" />
            <Button>
              <a href="/signup">Sign up</a>
            </Button>
            <Button>
              <a href="/signin">Sign in</a>
            </Button>
          </Flex>
        </Card>
      </Box>
    </Flex>
  );
}
