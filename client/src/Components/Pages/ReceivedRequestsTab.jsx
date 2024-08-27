import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Button,
  useToast,
  Flex,
} from "@chakra-ui/react";
import axiosInstance from "../../config/api";

const ReceivedRequestsTab = ({ requests, fetchRequests }) => {
  const toast = useToast();

  const handleAcceptRequest = async (requestId) => {
    try {
      await axiosInstance.post(`/exchange-requests/${requestId}/accept`);
      fetchRequests();
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
      fetchRequests();
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

  return (
    <>
      {requests.length === 0 ? (
        <Text>No received requests</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Requested By</Th>
              <Th>Requested Book</Th>
              <Th>Status</Th>
              <Th>Offered By</Th>
            </Tr>
          </Thead>
          <Tbody>
            {requests.map((request) => (
              <Tr key={request._id}>
                <Td>{request.requester?.username}</Td>
                <Td>
                  {request.requestedBook?.title} by{" "}
                  {request.requestedBook?.author}
                </Td>
                <Td>
                  {request.status !== "pending" ? (
                    request.status
                  ) : (
                    <Flex>
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
                </Td>
                <Td>
                  {request.offeredBook?.title} by {request.offeredBook?.author}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </>
  );
};

export default ReceivedRequestsTab;