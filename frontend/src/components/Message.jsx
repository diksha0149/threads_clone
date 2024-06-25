import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
// import { BsCheck2All } from "react-icons/bs";

const Message = ({ownMessage, message}) => {
    const selectedConversation = useRecoilValue(selectedConversationAtom)
    const currentUser = useRecoilValue(userAtom)
  return (
    <>
    {ownMessage ?(
        <Flex gap={2} alignSelf={"flex-end"}>
            <Text maxW={"350px"} bg={"blue.400"} p={1} borderRadius={"md"}>
                {message.text} 
            </Text>
            <Avatar src={currentUser.profilePic} w={"7"} h={"7"}/>
        </Flex>
    ) : (
        <Flex gap={2}>
            <Avatar src={selectedConversation.userProfilePic} w={"7"} h={"7"}/>
            <Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"} color={"black"}>
                {message.text}
            </Text>
        </Flex>
    )}
    </>
  )
}

export default Message
