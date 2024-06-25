import {
	Flex,
	Image,
	Input,
	InputGroup,
	InputRightElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Spinner,
	useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilState, useRecoilValue } from "recoil";

const MessageInput = ({setMessages}) => {

    const showToast = useShowToast()
    const [messageText, setMessageText] = useState("")
    const selectedConversation = useRecoilValue(selectedConversationAtom)
    const [conversations, setConversations] = useRecoilState(conversationsAtom)

    const handleSendMessage = async (e) =>{
        e.preventDefault();
        if(!messageText) return ;

        try {
            const res = await fetch("/api/messages",{
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({
                    message: messageText,
                    recipientId: selectedConversation.userId,
                }),
            })

            const data = await res.json();
            if(data.error){
                showToast("Error", data.error, "Error");
                return ;
            }

            setMessageText((messages) => [...messages, data])

            setConversations((prevConvs) => {
				const updatedConversations = prevConvs.map((conversation) => {
					if (conversation._id === selectedConversation._id) {
						return {
							...conversation,
							lastMessage: {
								text: messageText,
								sender: data.sender,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});

            setMessageText("");

        } catch (error) {
            showToast("Error", error.message, "error");
        }
    }


    return (
        <form onSubmit={handleSendMessage}>
            <InputGroup>
                <Input
                    w={"full"}
                    placeholder='Type a message'
                    onChange={(e) => setMessageText(e.target.value)}
                    value={messageText}
                />
                <InputRightElement  cursor={"pointer"} onSubmit={handleSendMessage}>
                    <IoSendSharp />
                </InputRightElement>
            </InputGroup>
        </form>
    )
}

export default MessageInput
