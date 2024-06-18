import { Button, useColorMode, useColorModeValue,useDisclosure,Modal,ModalOverlay,ModalContent, ModalHeader, ModalCloseButton,ModalBody,ModalFooter, FormControl, Textarea,Text, Flex, CloseButton } from '@chakra-ui/react'
import{ useRef, useState } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import usePreviewImg from '../hooks/usePreviewImg'
import { BsFillImageFill } from 'react-icons/bs'
import userAtom from "../atoms/userAtom"
import useShowToast from '../hooks/useShowToast'
import {useRecoilState, useRecoilValue} from 'recoil'
import postsAtom from '../atoms/postsAtom'
import { useParams } from 'react-router-dom'
// import { Text } from '@chakra-ui/react'

const MAX_CHAR = 500;

const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [postText, setPostText]=useState('');
    const {handleImgChange, imgUrl,setImgUrl} = usePreviewImg();
    const imageRef = useRef(null)
    const [remainingChar,setRemainingChar] = useState(MAX_CHAR);
    const user = useRecoilValue(userAtom)
    const showToast = useShowToast()
    const [loading,setLoading] = useState(false);
    const [posts, setPosts] = useRecoilState(postsAtom)
    const username = useParams()

    const handleTextChange = (e) =>{
      const inputText = e.target.value;
      if(inputText.length > MAX_CHAR){
        const truncatedText = inputText.slice(0,MAX_CHAR);
        setPostText(truncatedText);
        setRemainingChar(0);
      }else{
        setPostText(inputText);
        setRemainingChar(MAX_CHAR-inputText.length);
      }
    };

    const handleCreatePost = async () =>{
      if(loading) return;
      setLoading(true);
      try {
        const res = await fetch("api/posts/create",{
          method: "POST",
          headers: {
            "Content-Type" : "application/json"
          },
          body: JSON.stringify({postedBy: user._id, text: postText, img: imgUrl})
        })
  
        const data = await res.json();
        if(data.error){
          showToast("Error",data.error,"error");
          return ;
        }
        if(username === user.username){
          setPosts([data, ...posts]);
        }
        showToast("Success","Post Created Successfully","success");
        
        onClose()
        setPostText("");
        setImgUrl("")
      } catch (error) {
        showToast("Error",error,"error");
      }finally{
        setLoading(false);
      }
    };
  return (
    <>
    <Button position={"fixed"} bottom={10} right={5}  bg={useColorModeValue("gray.300","gray.dark")} size={{base: "sm", sm : "md"}}
    onClick={onOpen}>
        <AddIcon/>
    </Button>
      
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
           <FormControl>
            <Textarea placeholder='Post content goes here...'
            onChange={handleTextChange}
            value={postText}
            />
           <Text fontSize="xs" fontWeight="bold" textAlign={"right"} m={"1"} color={"gray.800"}>
            {remainingChar}/{MAX_CHAR}
           </Text>
           <input type='file' hidden ref={imageRef} onChange={handleImgChange}/>
           <BsFillImageFill style={{marginLeft:"%px", cursor:"pointer"}} size={16} onClick={()=>imageRef.current.click()}/>
           </FormControl>
           {imgUrl && (
            <Flex mt={5} w={"full"} position={"relative"}>
              <img src={imgUrl} alt='Selected Image'/>
              <CloseButton onClick={()=>{
                setImgUrl("");
              }}
              bg={"gray.800"}
              position={"absolute"}
              top={2}
              right={2}
              />
            </Flex>
           )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  )
}

export default CreatePost
