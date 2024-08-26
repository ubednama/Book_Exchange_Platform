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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axiosInstance from "../config/api";

const ExchangeRequests = () => {
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSentRequests = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/exchange-requests/sent");
      console.log("Sent Requests Data:", data); // Debugging line
      setSentRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch sent requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchReceivedRequests = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/exchange-requests");
      console.log("Received Requests Data:", data); // Debugging line
      setReceivedRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch received requests");
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
      // Refresh the data after accepting the request
      fetchSentRequests();
      fetchReceivedRequests();
    } catch (err) {
      console.error(err);
      setError("Failed to accept request");
    }
  };

  if (error) {
    return (
      <Box p={4}>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Tabs>
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
                  >
                    <Text>
                      Requested: {request.requestedBook?.title} by{" "}
                      {request.requestedBook?.author}
                    </Text>
                    <Text>Status: {request.status}</Text>
                    <Text>
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
                  >
                    <Text>
                      Requested: {request.requestedBook?.title} by{" "}
                      {request.requestedBook?.author}
                    </Text>
                    <Text>Status: {request.status}</Text>
                    <Text>
                      Offered: {request.offeredBook?.title} by{" "}
                      {request.offeredBook?.author}
                    </Text>
                    {request.status === "pending" && (
                      <Button onClick={() => handleAcceptRequest(request._id)}>
                        Accept
                      </Button>
                    )}
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