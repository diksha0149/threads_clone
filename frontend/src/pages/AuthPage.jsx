import { useRecoilValue } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import SignupCard from "../components/SignupCard";
import LoginCard from "../components/LoginCard";
import { Text, Flex, useColorModeValue } from "@chakra-ui/react";

const AuthPage = () => {
  const bg = useColorModeValue("#d1c8b4", "#839174");
  const authScreenState = useRecoilValue(authScreenAtom);
  console.log(authScreenState);
  return (
    <Flex gap={"10rem"} w={"98vw"} bg={bg}>
      <Text fontSize="8xl" pt={"3rem"} pl={"10rem"}>
        Building Threads Clone
      </Text>

      {authScreenState === "login" ? <LoginCard /> : <SignupCard />}
    </Flex>
  );
};

export default AuthPage;
