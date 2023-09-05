"use client";

import api from "@/services/api";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const router = useRouter();

  async function handleSubmit(e: any) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: response } = await api.post("/register", {
        name,
        email,
        password,
      });
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      router.push("/login");
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      toast({
        title: `${error?.response?.data?.message}`,
        status: "error",
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className=" flex flex-col gap-4 border p-8 max-w-md  rounded "
      >
        <Heading className="mb-4">Sign up</Heading>

        <FormControl className=" ">
          <FormLabel>Name *</FormLabel>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormControl>

        <FormControl className=" ">
          <FormLabel>Email *</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormControl>

        <FormControl className=" ">
          <FormLabel>Password *</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormControl>

        <Button
          type="submit"
          variant="outline"
          colorScheme="blue"
          isLoading={isLoading}
          loadingText="Sending..."
        >
          Send
        </Button>

        <Link href="/login" color="gray.500" _hover={{ color: "white" }}>
          Do you have an account?
        </Link>
      </form>
    </div>
  );
}
