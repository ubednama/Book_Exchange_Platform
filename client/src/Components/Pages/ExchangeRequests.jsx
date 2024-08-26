import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Text,
  Flex,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axiosInstance from "../../config/api";

const ExchangeRequests = () => {
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchSentRequests = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/exchange-requests/sent");
      setSentRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to fetch sent requests.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReceivedRequests = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/exchange-requests");
      setReceivedRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to fetch received requests.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentRequests();
    fetchReceivedRequests();
  }, []);

  const handleAcceptRequest = async (requestId) => {
    try {
      await axiosInstance.post(`/exchange-requests/${requestId}/accept`);
      fetchSentRequests();
      fetchReceivedRequests();
      toast({
        title: "Success",
        description: "Request accepted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to accept request.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await axiosInstance.post(`/exchange-requests/${requestId}/decline`);
      fetchSentRequests();
      fetchReceivedRequests();
      toast({
        title: "Success",
        description: "Request rejected successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to reject request.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleTabChange = (index) => {
    if (index === 0) {
      fetchSentRequests();
    } else if (index === 1) {
      fetchReceivedRequests();
    }
  };

  return (
    <Box p={4}>
      <Tabs onChange={handleTabChange}>
        <TabList>
          <Tab>Sent Requests</Tab>
          <Tab>Received Requests</Tab>
        </TabList>
        {loading ? (
          <Flex justify="center" width="100%">
            <Spinner color="red.500" />
          </Flex>
        ) : (
          <TabPanels>
            <TabPanel>
              {sentRequests.length === 0 ? (
                <Text>No sent requests</Text>
              ) : (
                sentRequests.map((request) => (
                  <Flex
                    key={request._id}
                    mb={2}
                    align="center"
                    justify="space-between"
                    p={2}
                    borderWidth={1}
                    borderRadius="md"
                    borderColor="gray.200"
                    bg="gray.50"
                    flexWrap="wrap"
                  >
                    <Text flex="1" isTruncated fontSize="sm" mr={2}>
                      Requested: {request.requestedBook?.title} by{" "}
                      {request.requestedBook?.author}
                    </Text>
                    <Flex direction="column" align="center" flex="1">
                      <Text fontSize="sm" mb={1}>
                        Status: {request.status}
                      </Text>
                    </Flex>
                    <Text flex="1" isTruncated fontSize="sm" ml={2}>
                      Offered: {request.offeredBook?.title} by{" "}
                      {request.offeredBook?.author}
                    </Text>
                  </Flex>
                ))
              )}
            </TabPanel>
            <TabPanel>
              {receivedRequests.length === 0 ? (
                <Text>No received requests</Text>
              ) : (
                receivedRequests.map((request) => (
                  <Flex
                    key={request._id}
                    mb={2}
                    align="center"
                    justify="space-between"
                    p={2}
                    borderWidth={1}
                    borderRadius="md"
                    borderColor="gray.200"
                    bg="gray.50"
                    flexWrap="wrap"
                  >
                    <Text flex="1" isTruncated fontSize="sm" mr={2}>
                      Requested: {request.requestedBook?.title} by{" "}
                      {request.requestedBook?.author}
                    </Text>
                    <Flex direction="column" align="center" flex="1">
                      {request.status !== "pending" ? (
                        <Text fontSize="sm" mb={1}>
                          Status: {request.status}
                        </Text>
                      ) : (
                        <Flex mt={2}>
                          <Button
                            size="sm"
                            colorScheme="green"
                            onClick={() => handleAcceptRequest(request._id)}
                            mr={2}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => handleRejectRequest(request._id)}
                          >
                            Reject
                          </Button>
                        </Flex>
                      )}
                    </Flex>
                    <Text flex="1" isTruncated fontSize="sm" ml={2}>
                      Offered: {request.offeredBook?.title} by{" "}
                      {request.offeredBook?.author}
                    </Text>
                  </Flex>
                ))
              )}
            </TabPanel>
          </TabPanels>
        )}
      </Tabs>
    </Box>
  );
};

export default ExchangeRequests;