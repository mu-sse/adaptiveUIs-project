
import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, Textarea } from '@chakra-ui/react';


import React, { InputHTMLAttributes, useState } from 'react'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    id: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};


//"" => false
//"error message" => true
function InputField( {label, id, placeholder, value, onChange }: InputFieldProps) {
   
    const handleInputChange = (e) => onChange(e.target.value)
  
    const isError = value === ''

    return (
      <FormControl isInvalid={isError}>
        <FormLabel>{label}</FormLabel>
        <Input value={value} onChange={onChange} placeholder={placeholder} />
        {!isError ? (
          <FormHelperText>
            Enter the {label} 
          </FormHelperText>
        ) : (
          <FormErrorMessage>{label} field cannot be empty</FormErrorMessage>
        )}
      </FormControl>
    )

   
  
}
export default InputField;