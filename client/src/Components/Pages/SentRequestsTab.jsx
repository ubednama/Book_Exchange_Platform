import { Table, Thead, Tbody, Tr, Th, Td, Text } from "@chakra-ui/react";

const SentRequestsTab = ({ requests }) => {
  return (
    <>
      {requests.length === 0 ? (
        <Text>No sent requests</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Requested To</Th>
              <Th>Requested Book</Th>
              <Th>Status</Th>
              <Th>Offered By</Th>
            </Tr>
          </Thead>
          <Tbody>
            {requests.map((request) => (
              <Tr key={request._id}>
                <Td>{request.requestedTo?.username}</Td>
                <Td>
                  {request.requestedBook?.title} by{" "}
                  {request.requestedBook?.author}
                </Td>
                <Td>{request.status}</Td>
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

export default SentRequestsTab;