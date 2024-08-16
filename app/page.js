"use client";
import { Box, Stack, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizeddark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { useRouter } from "next/navigation";

export default function ChatInterface() {
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content: `Hi! I am your virtual support agent. How can I help you today?`,
    },
  ]);

  const [userInput, setUserInput] = useState("");
  const navigate = useRouter();
  const [currentUserSession, setCurrentUserSession] = useState(null);

  useEffect(() => {
    const sessionData = sessionStorage.getItem("user");
    setCurrentUserSession(sessionData);
  }, []);

  const handleSendMessage = async () => {
    const outgoingMessage = userInput;
    setUserInput("");

    setChatHistory((previousHistory) => [
      ...previousHistory,
      { role: "user", content: outgoingMessage },
      { role: "assistant", content: "" },
    ]);

    const response = fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...chatHistory, { role: "user", content: outgoingMessage }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let result = "";
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const decodedText = decoder.decode(value || new Int8Array(), { stream: true });
        setChatHistory((previousHistory) => {
          let lastEntry = previousHistory[previousHistory.length - 1];
          let allPreviousEntries = previousHistory.slice(0, previousHistory.length - 1);
          return [
            ...allPreviousEntries,
            {
              ...lastEntry,
              content: lastEntry.content + decodedText,
            },
          ];
        });
        return reader.read().then(processText);
      });
    });
  };

  const markdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={solarizeddark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgcolor="purple" // Changed background color to purple
      margin="0"
      padding="0"
      overflow="hidden"
    >
      {/* Logout button at the top */}
      <Box
        width="100%"
        display="flex"
        justifyContent="flex-end"
        p={2}
        position="absolute"
        top="0"
        zIndex={1}
      >
        {/* Add your logout button here if needed */}
      </Box>

      <Stack
        direction="column"
        width="100%"
        maxWidth="800px"
        height="100%"
        borderRadius={12}
        bgcolor="#2c2c2c"
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.3)"
        p={2}
        spacing={2}
        overflow="hidden"
      >
        {/* Messaging section */}
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          p={2}
          sx={{
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-track': { backgroundColor: '#2c2c2c' },
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#555', borderRadius: '4px' }
          }}
        >
          {chatHistory.map((chatEntry, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                chatEntry.role === "assistant" ? "flex-start" : "flex-end"
              }
            >
              <Box
                bgcolor={
                  chatEntry.role === "assistant" ? "#333" : "purple"  // Changed chat color to purple
                }
                color="white"
                borderRadius={8}
                p={2}
                maxWidth="80%"
                sx={{ wordBreak: 'break-word' }}
              >
                <ReactMarkdown 
                  components={markdownComponents}
                  sx={{ color: 'purple' }}  // Changed ReactMarkdown text color to purple
                >
                  {chatEntry.content}
                </ReactMarkdown>
              </Box>
            </Box>
          ))}
        </Stack>

        {/* Text field and button */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          p={1}
          borderTop="1px solid #444"
          bgcolor="#2c2c2c"
        >
          <TextField
            label="Message"
            placeholder="Type something"
            fullWidth
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 20,
              bgcolor: "#333",
              input: { color: 'white' },
              fieldset: { borderColor: '#444' }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            sx={{
              borderRadius: 20,
              bgcolor: 'purple',  // Changed button color to purple
              '&:hover': { bgcolor: '#0056b3' },
              px: 3,
              textTransform: 'capitalize'
            }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
