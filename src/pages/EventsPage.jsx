import React, { useState, useEffect } from "react";
import {
  Heading,
  Box,
  Flex,
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
  Select,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialFormValues = {
    title: "",
    description: "",
    image: "",
    location: "",
    startTime: "",
    endTime: "",
    categoryIds: [],
  };
  const [newEvent, setNewEvent] = useState(initialFormValues);
  const [categories, setCategories] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetch("http://localhost:3000/events")
      .then((response) => response.json())
      .then((data) => {
        const updatedEvents = data.map((event) => ({
          ...event,
          categoryIds: event.categoryIds || [],
        }));
        setEvents(updatedEvents);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleModalInputChange = (event) => {
    const { name, value } = event.target;
    setNewEvent({
      ...newEvent,
      [name]: value,
    });
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleAddEvent = () => {
    const eventData = {
      title: newEvent.title,
      description: newEvent.description,
      image: newEvent.image,
      location: newEvent.location,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      categoryIds: newEvent.categoryIds,
      createdBy: 1,
    };

    fetch("http://localhost:3000/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })
      .then((response) => response.json())
      .then((data) => {
        setEvents([...events, data]);
        onClose();
        setNewEvent(initialFormValues);
        toast({
          title: "Event added!",
          description: "Your event has been successfully added.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error("Error creating event:", error);
        toast({
          title: "Error",
          description:
            "An error occurred while adding the event. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const filteredEvents = events
    .filter((event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((event) => {
      if (!selectedCategory) return true;

      return (
        event.categoryIds.includes(parseInt(selectedCategory)) ||
        event.categoryIds.length === 0
      );
    });

  return (
    <div>
      <Heading>List of events</Heading>
      <FormControl mt="4">
        <FormLabel>Search Events</FormLabel>
        <Input
          type="text"
          placeholder="Enter keywords"
          value={searchQuery}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl mt="4">
        <FormLabel>Filter by Category</FormLabel>
        <Select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <Flex flexWrap="wrap">
        {filteredEvents.map((event) => (
          <Link key={event.id} to={`/event/${event.id}`}>
            <Box borderWidth="1px" borderRadius="lg" p="4" m="4" width="300px">
              <Image
                src={event.image}
                alt={event.title}
                height="200px"
                objectFit="cover"
              />
              <Heading size="md" mt="2">
                {event.title}
              </Heading>
              <Text mt="2">{event.description}</Text>
              <Text mt="2">Location: {event.location}</Text>
              <Text mt="2">
                Start Time: {new Date(event.startTime).toLocaleString()}
              </Text>
              <Text mt="2">
                End Time: {new Date(event.endTime).toLocaleString()}
              </Text>
            </Box>
          </Link>
        ))}
      </Flex>

      <Button mt="4" colorScheme="teal" onClick={onOpen}>
        Add event
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={newEvent.title}
                onChange={handleModalInputChange}
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={newEvent.description}
                onChange={handleModalInputChange}
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>Image URL</FormLabel>
              <Input
                name="image"
                value={newEvent.image}
                onChange={handleModalInputChange}
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>Location</FormLabel>
              <Input
                name="location"
                value={newEvent.location}
                onChange={handleModalInputChange}
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>Start Time</FormLabel>
              <Input
                type="datetime-local"
                name="startTime"
                value={newEvent.startTime}
                onChange={handleModalInputChange}
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>End Time</FormLabel>
              <Input
                type="datetime-local"
                name="endTime"
                value={newEvent.endTime}
                onChange={handleModalInputChange}
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>Categories</FormLabel>
              <Select
                name="categoryIds"
                value={newEvent.categoryIds}
                onChange={handleModalInputChange}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddEvent}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
