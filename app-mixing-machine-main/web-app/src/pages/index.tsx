import {
  Button,
  Flex,
  Heading,
  Link,
  Spinner,
  VStack,
} from '@chakra-ui/react'

import InputField from '../components/InputField'
import { useState } from 'react';
import router, { useRouter } from 'next/router';
import * as constants from "../config/constants";

interface Login{
  userid: string; 
  role:string;
}

async function login(username: String): Promise<Login> {
  try {
    const res = await fetch(constants._API_URL + 'users?' + username, {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"       
      }
    });
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUserInput] = useState("");
  const [userData, setUserData] = useState(null);

  const router = useRouter();
  const handleLogin =  async () => {  
    const jsonResponse = await login(username);
    if(!jsonResponse){
      setUserInput("");
    }
    else{
      const userid = jsonResponse[0].userid;
      const role = jsonResponse[0].role;
     
    
    
      router.push({
        pathname: "/preparation",
        query: { userid, role}
      });
      setIsLoading(true);
    }    
  };

return (


  <Flex h="100vh" w= "full" py={20} justifyContent="center">
  <VStack w="70%" h="min-content" p={10} alignItems="center"  spacing={'24px'} borderWidth="1px" borderColor="gray.300" borderRadius="md">
  <Heading as='h4' size='md' >
    Mixture Machine 
  </Heading>
  <InputField label="User ID" id="userId" placeholder="Enter your user ID" value={username} onChange={e => setUserInput(e.target.value)}></InputField>
  <Button w="full" onClick={handleLogin} isLoading={isLoading}>Login</Button>
  {isLoading && (
      <Spinner
        size="xl"
        position="relative"
        top={0}
        left={0}
        bottom={0}
        right={0}
        zIndex={1}
      />
    )}
  <Link color='teal.500' href='/registerusr'>
  Register
  </Link>
  </VStack>
 
  </Flex>
)
  }
export default Index
