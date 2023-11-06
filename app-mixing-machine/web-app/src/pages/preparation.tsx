import { Heading, VStack } from "@chakra-ui/react";
import {renderJSON} from "../functions/renderJSON"
export async function getServerSideProps(context) {
    // extract userId and userRole from the query parameters in the context object
    const { query } = context;
    const userId = query.userid;
    const userRole = query.role;
  
    // pass userId and userRole as props to the page component
    return {
      props: {
        userId,
        userRole,
      },
    };
  }
const preparation = ({ userId, userRole }) => {
  const ui = require("../ui.json");
  console.log("json",ui)
  return (          
      <VStack w="full" h="min-content" p={2} alignItems="center"  spacing={'2px'} >  
     
          <Heading as='h4' size='md'>
              Mixing Machine 
          </Heading>
          {renderJSON(ui, userId)}
      </VStack>
  );
};

export default preparation;
