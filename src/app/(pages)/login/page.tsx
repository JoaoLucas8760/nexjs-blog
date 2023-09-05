"use client";

import api from "@/services/api";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "@chakra-ui/next-js";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import { useUser } from "@/contexts/useUser";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUser();

  const router = useRouter();

  async function handleSubmit(e: any) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: response } = await api.post("/login", {
        email,
        password,
      });

      setUser(response.user);
      api.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;
      Cookie.set("auth_token", response.token);
      router.push("/");
    } catch (error: any) {
      console.log(error.response.data.message);
      alert(error.response.data.message);
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
        <Heading className="mb-4">Sign in</Heading>

        <FormControl className=" ">
          <FormLabel>Email *</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            colorScheme="purple"
          />
        </FormControl>

        <FormControl className=" ">
          <FormLabel>Password *</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            colorScheme="purple"
          />
        </FormControl>

        <Button
          type="submit"
          variant="outline"
          isLoading={isLoading}
          loadingText="Sending..."
        >
          Send
        </Button>

        <Link href="/register" color="gray.500" _hover={{ color: "white" }}>
          Don&apos;t have an account?
        </Link>
      </form>
    </div>
  );
}
