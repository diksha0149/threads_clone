import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Avatar,
    Center,
  } from '@chakra-ui/react';
import userAtom from '../atoms/userAtom';
import { useRecoilState } from "recoil";
import { useRef, useState } from 'react';
import usePreviewImg from '../hooks/usePreviewImg';
import useShowToast from '../hooks/useShowToast';
  
  export default function UpdateProfilePage() {
    const[user,setUser] = useRecoilState(userAtom)
    const [inputs,setInputs] = useState({
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        password: "",
    });
    const fileref = useRef(null);
    const [updating,setUpdating] = useState(false);

    const { handleImgChange, imgUrl } = usePreviewImg()
    const showToast = useShowToast()

    const handleSubmit = async(e)=>{
      e.preventDefault();
      if(updating) return ;
      setUpdating(true);
      try {
        console.log(inputs)
        const res = await fetch(`/api/users/update/${user._id}`,{
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({...inputs,profilePic:imgUrl}),
        });
        const data = await res.json();// updated user object
        console.log(data);
        if(data.error){
          showToast("Error",error,"error");
          return;
        }
        showToast("Success","Profile Updated Successfully","success");
        setUser(data);
        localStorage.setItem("user-threads",JSON.stringify(data));
      } catch (error) {
        showToast("Error",error,"error");
      } finally{
        setUpdating(false);
      }
    };
    return (
      <form onSubmit = {handleSubmit}>
      <Flex align={'center'} justify={'center'} my={6}
        >
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.dark')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            User Profile Edit
          </Heading>
          <FormControl id="userName">
            <Stack direction={['column', 'row']} spacing={6}>
              <Center>
                <Avatar size="xl" boxShadow={"md"} src={imgUrl || user.profilePic}/>
              </Center>
              <Center w="full">
                <Button w="full" onClick={()=>fileref.current.click()}>Change Avatar</Button>
                <input type='file' hidden ref={fileref} onChange={handleImgChange}/>
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder="JohnDoe"
              value={inputs.name}
              onChange ={(e)=>setInputs({...inputs,name: e.target.value})}
              _placeholder={{ color: 'gray.500' }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="johndoe"
              value={inputs.username}
              // e is basically an event , contain information about the event that occured
              onChange={(e) => setInputs({...inputs,username: e.target.value})}
              _placeholder={{ color: 'gray.500' }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              value={inputs.email}
              onChange={(e)=>setInputs({...inputs,email: e.target.value})}
              _placeholder={{ color: 'gray.500' }}
              type="email"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="Your Bio"
              value={inputs.bio}
              onChange={(e) => setInputs({...inputs,bio:e.target.value})}
              _placeholder={{ color: 'gray.500' }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              value={inputs.password}
              onChange={(e)=>setInputs({...inputs,password:e.target.value})}
              _placeholder={{ color: 'gray.500' }}
              type="password"
            />
          </FormControl>
          <Stack spacing={6} direction={['column', 'row']}>
            <Button
              bg={'red.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'red.500',
              }}>
              Cancel
            </Button>
            <Button
              bg={'green.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'green.500',
              }}
              type='submit'
              isLoading={updating}
              >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
      </form>
    );
  }