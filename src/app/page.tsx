"use client";

import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Textarea,
  useToast,
  Text,
  Wrap,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";
import api from "@/services/api";
import { Post } from "@/components/Post";
import { useQuery } from "@tanstack/react-query";

export default function Posts() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const toast = useToast();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const { data: posts, refetch: posts_refetech } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data: response } = await api.get("/posts");

      return response;
    },
    initialData: [],
  });

  const { data: myposts, refetch: myposts_refetech } = useQuery({
    queryKey: ["myposts"],
    queryFn: async () => {
      const { data: response } = await api.get("/posts?own=true");
      console.log(response);
      return response;
    },
    initialData: [],
  });

  async function handleNewPost(e: any) {
    e.preventDefault();
    try {
      const { data: response } = await api.post("/posts", { title, content });
      console.log(response);
      posts_refetech();
      myposts_refetech();

      onClose();
      toast({
        title: `Sucess!`,
        status: "success",
        isClosable: true,
      });
    } catch (error: any) {
      console.error(error);
    } finally {
      setTitle("");
      setContent("");
    }
  }

  console.log(posts);
  return (
    <main className="flex justify-center h-full  ">
      <div className="flex w-full  flex-col gap-4 bg-gray-950  border-gray-800 p-8 h-full md:w-[51rem] md:border">
        <Button
          className="self"
          onClick={onOpen}
          colorScheme="purple"
          variant="outline"
          leftIcon={<AddIcon />}
        >
          New Post
        </Button>
        <Tabs colorScheme="purple" variant="enclosed" className="rounded">
          <div className="flex  flex-row">
            <TabList>
              <Tab>All posts</Tab>
              <Tab>My Posts</Tab>
            </TabList>
          </div>
          <TabPanels>
            <TabPanel>
              {posts.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {posts.map((post: any, index: number) => (
                    <Post
                      key={post.id}
                      id={post.id}
                      title={post.title}
                      content={post.content}
                      authorId={post.user_id}
                      refetch={posts_refetech}
                      refetchmypost={myposts_refetech}
                      createdAt={post.created_at}
                      updatedAt={post.updated_at}
                      userPost={post.user}
                    />
                  ))}
                </div>
              ) : (
                <Text>No posts here yet</Text>
              )}
            </TabPanel>
            <TabPanel>
              {myposts.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {myposts.map((post: any, index: number) => (
                    <Post
                      key={post.id}
                      id={post.id}
                      title={post.title}
                      content={post.content}
                      authorId={post.user_id}
                      refetch={posts_refetech}
                      refetchmypost={myposts_refetech}
                      createdAt={post.created_at}
                      updatedAt={post.updated_at}
                      userPost={post.user}
                    />
                  ))}
                </div>
              ) : (
                <Text>No posts here yet</Text>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
          colorScheme="purple"
        >
          <ModalOverlay />
          <ModalContent color={"gray.600"} background={"gray.900"}>
            <form onSubmit={handleNewPost}>
              <ModalHeader>New Post</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input
                    ref={initialRef}
                    placeholder="Type your post title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    color={"gray.200"}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Content</FormLabel>
                  <Textarea
                    placeholder="Type your post content"
                    size="sm"
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    color={"gray.200"}
                  />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button
                  type="submit"
                  colorScheme="purple"
                  variant="outline"
                  mr={3}
                >
                  Save
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  colorScheme="gray"
                  className="text-white"
                >
                  Cancel
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </div>
    </main>
  );
}
