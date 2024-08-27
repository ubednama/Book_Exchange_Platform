import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  Flex,
  Spinner,
  useToast,
  TabPanel,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axiosInstance from "../../config/api";
import SentRequestsTab from "./SentRequestsTab";
import ReceivedRequestsTab from "./ReceivedRequestsTab";

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
  }, []);

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
              <SentRequestsTab requests={sentRequests} />
            </TabPanel>
            <TabPanel>
              <ReceivedRequestsTab
                requests={receivedRequests}
                fetchRequests={fetchReceivedRequests}
              />
            </TabPanel>
          </TabPanels>
        )}
      </Tabs>
    </Box>
  );
};

export default ExchangeRequests;
