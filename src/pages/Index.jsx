import { Container, VStack, Text, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input, Textarea, Box, IconButton } from "@chakra-ui/react";
import { FaRegSmile } from "react-icons/fa";
import React, { useState } from "react";

const Index = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [newPost, setNewPost] = useState({ title: "", body: "" });

  const handleLogin = (username, password) => {
    // Placeholder for login logic
    setUser({ username });
    onClose();
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handlePostCreation = () => {
    const post = {
      id: posts.length + 1,
      title: newPost.title,
      body: newPost.body,
      date: new Date().toISOString(),
      author: user.username,
      reactions: {}
    };
    setPosts([...posts, post]);
    setNewPost({ title: "", body: "" });
  };

  const handleReaction = (postId, emoji) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const reactions = post.reactions[user.username] || [];
        if (!reactions.includes(emoji)) {
          console.log(`Reaction added by ${user.username}: ${emoji}`);
          return { ...post, reactions: { ...post.reactions, [user.username]: [...reactions, emoji] } };
        }
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  const handleDeletePost = (postId) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts);
  };

  return (
    <Container maxW="container.md" p={4}>
      <VStack spacing={4} align="stretch">
        <Box d="flex" justifyContent="space-between" alignItems="center">
          <Text fontSize="2xl">Public Post Board</Text>
          <Button onClick={user ? handleLogout : onOpen}>{user ? "Logout" : "Login"}</Button>
        </Box>
        {user && (
          <Box>
            <Input placeholder="Title" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} />
            <Textarea placeholder="Body" value={newPost.body} onChange={(e) => setNewPost({ ...newPost, body: e.target.value })} />
            <Button onClick={handlePostCreation}>Post</Button>
          </Box>
        )}
        {posts.map(post => (
          <Box key={post.id} p={4} shadow="md" borderWidth="1px">
            <Text fontSize="xl">{post.title}</Text>
            <Text mt={4}>{post.body}</Text>
            <Text fontSize="sm">By {post.author} on {new Date(post.date).toLocaleDateString()}</Text>
            <IconButton aria-label="React" icon={<FaRegSmile />} onClick={() => handleReaction(post.id, 'smile')} />
            {post.author === user?.username && <Button onClick={() => handleDeletePost(post.id)}>Delete</Button>}
          </Box>
        ))}
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input placeholder="Username" />
            <Input placeholder="Password" type="password" />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => handleLogin("user", "pass")}>
              Login
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Index;