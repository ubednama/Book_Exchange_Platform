import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Button,
  Flex,
} from "@chakra-ui/react";
import useHandleRequest from "../../hooks/useHandleRequest";

const ReceivedRequestsTab = ({ requests, fetchRequests }) => {
  const  {
    handleAcceptRequest,
    handleRejectRequest
  } = useHandleRequest();

  const handleReject = (requestId) => {
    handleRejectRequest(requestId, fetchRequests)
  }

  const handleAccept = (requestId) => {
    handleAcceptRequest(requestId, fetchRequests)
  }

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
                        onClick={() => handleAccept(request._id)}
                        mr={2}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleReject(request._id)}
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