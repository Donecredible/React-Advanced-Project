import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heading,
  Box,
  Image,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

export const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [creator, setCreator] = useState(null);
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetch(`http://localhost:3000/events/${eventId}`)
      .then((response) => response.json())
      .then((data) => {
        setEvent(data);
        fetch(`http://localhost:3000/users/${data.createdBy}`)
          .then((response) => response.json())
          .then((userData) => {
            setCreator(userData);
          })
          .catch((error) => {
            console.error("Error fetching creator:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
      });
  }, [eventId]);

  const handleEditModalOpen = () => {
    onEditModalOpen();
  };

  const handleEditModalClose = () => {
    onEditModalClose();
  };

  const handleUpdateEvent = (updatedEvent) => {
    fetch(`http://localhost:3000/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEvent),
    })
      .then((response) => response.json())
      .then((data) => {
        setEvent(data);
        onEditModalClose();
        toast({
          title: "Event Updated!",
          description: "The event details have been successfully updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error("Error updating event:", error);
        toast({
          title: "Error",
          description:
            "An error occurred while updating the event details. Please try again later.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleDeleteEvent = () => {
    // Make the DELETE request to delete the event
    fetch(`http://localhost:3000/events/${eventId}`, {
      method: "DELETE",
    })
      .then(() => {
        // Show success toast
        toast({
          title: "Event Deleted!",
          description: "The event has been successfully deleted.",
          status: "success",
          duration: 3000, // Duration in milliseconds (3 seconds)
          isClosable: true,
        });
        // Navigate the user to the root after successful deletion
        navigate("/");
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
        // Show error toast
        toast({
          title: "Error",
          description:
            "An error occurred while deleting the event. Please try again later.",
          status: "error",
          duration: 3000, // Duration in milliseconds (3 seconds)
          isClosable: true,
        });
      });
  };

  if (!event || !creator) {
    // If event or creator data is not yet available, show a loading message or a spinner
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <Heading>{event.title}</Heading>
      <Text mt="2">Description: {event.description}</Text>
      <Image
        src={event.image}
        alt={event.title}
        mt="2"
        maxH="300px"
        objectFit="cover"
      />
      <Text mt="2">
        Start Time: {new Date(event.startTime).toLocaleString()}
      </Text>
      <Text mt="2">End Time: {new Date(event.endTime).toLocaleString()}</Text>
      <Text mt="2">Categories: {event.categoryIds.join(", ")}</Text>
      <Box mt="4" display="flex" alignItems="center">
        <Image
          src={creator.image}
          alt={creator.name}
          boxSize="50px"
          borderRadius="full"
        />
        <Text ml="2">Created by: {creator.name}</Text>
      </Box>

      <Button mt="4" colorScheme="blue" onClick={handleEditModalOpen}>
        Edit
      </Button>

      <Button mt="4" colorScheme="red" onClick={onDeleteModalOpen}>
        Delete
      </Button>

      <Modal isOpen={isEditModalOpen} onClose={handleEditModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={event.title}
                onChange={(e) => setEvent({ ...event, title: e.target.value })}
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={event.description}
                onChange={(e) =>
                  setEvent({ ...event, description: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>Image URL</FormLabel>
              <Input
                name="image"
                value={event.image}
                onChange={(e) => setEvent({ ...event, image: e.target.value })}
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>Start Time</FormLabel>
              <Input
                type="datetime-local"
                name="startTime"
                value={event.startTime}
                onChange={(e) =>
                  setEvent({ ...event, startTime: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>End Time</FormLabel>
              <Input
                type="datetime-local"
                name="endTime"
                value={event.endTime}
                onChange={(e) =>
                  setEvent({ ...event, endTime: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>Categories</FormLabel>
              <Input
                name="categories"
                value={event.categoryIds.join(", ")}
                onChange={(e) =>
                  setEvent({
                    ...event,
                    categoryIds: e.target.value
                      .split(",")
                      .map((categoryId) => parseInt(categoryId.trim())),
                  })
                }
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleUpdateEvent(event)}
            >
              Save
            </Button>
            <Button onClick={handleEditModalClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this event?</ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDeleteEvent}>
              Delete
            </Button>
            <Button onClick={onDeleteModalClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
