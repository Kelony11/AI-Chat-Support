'use client'

import { Box, Stack, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "@/app/firebase/config";
// import { useRouter } from "next/navigation";
// import { signOut } from "firebase/auth";



export default function Home() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Hi, I am Vrix Furniture Support Agent, how can I assist you today?'
  }]);

  const [message, setMessage] = useState('')

  const sendMessage = async()=>{
    setMessage('')
    setMessages((messages)=> [
      ...messages,
      {role: 'user', content: message},
      {role: 'assistant', content: ''},
      
    ])

    const response = fetch('/api/chat', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: [...messages, {role: 'user', content: message}] }),


    }).then(async(res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result = ''
      return reader.read().then(function proccessText({done, value}) {
        if (done) {
          return result
        }

        const text = decoder.decode(value || new Int8Array(), {stream: true})
        setMessages((messages) => {
          let lastMessage = messages[message.length - 1]
          let otherMessages = message.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ]
        })

        return reader.read().then(proccessText)
      })
    })


  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction="column"
        width='600px'
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display='flex'
              justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'} 
            >
              <Box
                bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'}
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
          <Stack
            direction="row" spacing={2}>
          <TextField
            label="messages"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            sx={{
              borderRadius: 20,
              bgcolor: '#007bff',
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





// export default function Home() {
//   const [messages, setMessages] = useState([{
//     role: 'assistant',
//     content: 'Hi, I am Vrix Furniture Support Agent, how can I assist you today?'
//   }]);
  
//   const [message, setMessage] = useState('');

//   const sendMessage = async () => {
    
//     setMessages((messages) => [
//       ...messages,
//       { role: 'user', content: message },
//     ]);
//     setMessage('');
    
    
//     const response = await fetch('/api/chat', {
//       method: "POST",
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ role: 'user', content: message })
//     });

   
//     response.json().then((data) => {
//       setMessages((messages) => [
//         ...messages,
//         { role: 'assistant', content: data.response } 
//       ]);
//     });
//   }

//   return (
//     <Box
//       width="100vw"
//       height="100vh"
//       display="flex"
//       flexDirection="column"
//       justifyContent="center"
//       alignItems="center"
//     >
//       <Stack
//         direction="column"
//         width='600px'
//         height="700px"
//         border="1px solid black"
//         p={2}
//         spacing={3}
//       >
//         <Stack
//           direction="column"
//           spacing={2}
//           flexGrow={1}
//           overflow="auto"
//           maxHeight="100%"
//         >
//           {messages.map((message, index) => (
//             <Box
//               key={index}
//               display='flex'
//               justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
//             >
//               <Box
//                 bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'}
//                 color="white"
//                 borderRadius={16}
//                 p={3}
//               >
//                 {message.content}
//               </Box>
//             </Box>
//           ))}
//         </Stack>
//         <Stack
//           direction="row"
//           spacing={2}
//         >
//           <TextField
//             label="Message"
//             fullWidth 
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <Button
//             variant="contained"
//             onClick={sendMessage} 
//           >
//             Send
//           </Button>
//         </Stack>
//       </Stack>
//     </Box>
//   )
// }