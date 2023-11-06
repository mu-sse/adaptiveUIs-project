import { Button, FormLabel, HStack, Input, useToast  } from "@chakra-ui/react"
import { useState } from "react";


function NumberInput({label, idIncrement, idDecrease, onClick, defaultValue, userId}) {
  const toast = useToast();
  const [value, setValue] = useState(defaultValue);
  const handleIncrementDecrement = (e,operation:string,valueOperation) => {
    if ((operation==="increment" && value < 3)||(operation==="decrement"&&value > 0)) {
      toast({      
        description: "Additive has been "+operation+"ed",
        status: 'info',
        duration: 3000,
        isClosable: true,
      })
      setValue(value + valueOperation);
      onClick(e.target.id,userId)
    }

  };


  return (
    <HStack maxW='320px'>
      <FormLabel>{label}</FormLabel>
      <Button id= {idIncrement} onClick={e=>{handleIncrementDecrement(e,"increment",1)}}>+</Button>
      <Input value={value} htmlSize={4} width='auto' readOnly/>
      <Button id= {idDecrease} onClick={e=>handleIncrementDecrement(e,"decrement",-1)}>-</Button>
    </HStack>
  )

}
export default NumberInput;