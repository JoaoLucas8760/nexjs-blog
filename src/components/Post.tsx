"use client";

import { useUser } from "@/contexts/useUser";
import api from "@/services/api";
import { formatDateTime } from "@/utils/formatDateTime";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Heading,
  Text,
  Box,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  ModalFooter,
  Wrap,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  refetch: any;
  refetchmypost: any;
  createdAt: Date;
  updatedAt: Date;
  userPost: any;
};

export function Post({
  title,
  content,
  id,
  authorId,
  refetch,
  refetchmypost,
  createdAt,
  updatedAt,
  userPost,
}: Post) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [titleForm, setTitleForm] = useState(title);
  const [contentForm, setContentForm] = useState(content);
  const [showDialog, setShowDialog] = useState(false);
  const [showModalDetails, setShowModalDetails] = useState(false);

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const toast = useToast();
  const cancelRef = useRef();
  const { user } = useUser();

  const onCloseDialog = () => {
    setShowDialog(false);
  };

  async function handleDeletePost() {
    try {
      await api.delete(`/posts/${id}`);
      refetch();
      refetchmypost();
      onClose();

      toast({
        title: "Post Deleted.",

        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Sorry, Something wrong.",

        status: "error",
        duration: 9000,
        isClosable: true,
      });
      onClose();
    }
  }

  async function handleEditPost(e: any) {
    e.preventDefault();
    try {
      const { data: response } = await api.put(`/posts/${id}`, {
        title: titleForm,
        content: contentForm,
      });
      console.log("response", response);
      refetch();
      refetchmypost();
      onClose();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box className="gap-2 flex flex-col bg-gray-900 p-4 rounded relative">
      {authorId === user.id && (
        <IconButton
          onClick={onOpen}
          className="absolute top-0 right-0"
          isRound={true}
          variant="solid"
          colorScheme="teal"
          aria-label="Done"
          fontSize="20px"
          icon={<EditIcon />}
        />
      )}

      {authorId === user.id && (
        <IconButton
          onClick={() => setShowDialog(true)}
          className="absolute top-[2rem] right-0"
          isRound={true}
          variant="solid"
          colorScheme="red"
          aria-label="Done"
          fontSize="20px"
          icon={<DeleteIcon />}
        />
      )}
      <Heading>{title}</Heading>

      <Text>{content}</Text>
      <Text
        onClick={() => setShowModalDetails(true)}
        className="text-blue-500 cursor-pointer w-16"
        fontSize="xs"
      >
        see details
      </Text>

      <AlertDialog
        isOpen={showDialog}
        // @ts-ignore
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        colorScheme="gray"
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              className="text-black"
              fontSize="lg"
              fontWeight="bold"
            >
              Delete Post
            </AlertDialogHeader>

            <AlertDialogBody className="text-black">
              Are you sure? You can&apos;t undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                // @ts-ignore
                ref={cancelRef}
                variant={"outline"}
                onClick={onCloseDialog}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                variant={"outline"}
                onClick={handleDeletePost}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        colorScheme="purple"
      >
        <ModalOverlay />
        <ModalContent color={"gray.600"} background={"gray.900"}>
          <form onSubmit={handleEditPost}>
            <ModalHeader>New Post</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Type your post title"
                  required
                  value={titleForm}
                  onChange={(e) => setTitleForm(e.target.value)}
                  color={"gray.200"}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Content</FormLabel>
                <Textarea
                  placeholder="Type your post content"
                  size="sm"
                  required
                  value={contentForm}
                  onChange={(e) => setContentForm(e.target.value)}
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

      <Modal
        onClose={() => setShowModalDetails(false)}
        isOpen={showModalDetails}
        isCentered
      >
        <ModalOverlay />
        <ModalContent color={"gray.500"} background={"gray.900"}>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col">
              <Text>Created at: {formatDateTime(createdAt)}</Text>
              {updatedAt !== createdAt && (
                <Text>Updated at: {formatDateTime(updatedAt)}</Text>
              )}

              <Text>Author: {userPost.name}</Text>
              <Text>Post Id: {id}</Text>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="purple"
              variant={"outline"}
              onClick={() => setShowModalDetails(false)}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
