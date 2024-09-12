import { useToast } from "@chakra-ui/react";
import axiosInstance from "../config/api";

const useHandleRequest = () => {
    const toast = useToast();
    
    const handleAcceptRequest = async (requestId, fetchRequests) => {
        try {
            await axiosInstance.post(`/exchange-requests/${requestId}/accept`);
            fetchRequests();
            toast({description: "Request accepted successfully",
                title: "Success",
                status: "success",
                duration: 5000,
                isClosable: true
            })
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to accept request.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }

    const handleRejectRequest = async (requestId, fetchRequests) => {
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

    return {
        handleAcceptRequest,
        handleRejectRequest
    }

}

export default useHandleRequest;
