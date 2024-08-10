import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage.jsx";
import LoginCard from "./components/LoginCard.jsx";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
import { Flex } from "@chakra-ui/react";
function App() {
  const user = useRecoilValue(userAtom);
  // const { pathname } = useLocation();
  return (
    <Box position={"relative"} maxW="100%">
      {/* <Container maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}> */}
      <Container maxW="95vw">
        <Flex align={"end"} justify={"start"} direction={"column"}>
          <Header />
          <Routes>
            <Route
              path="/"
              element={user ? <HomePage /> : <Navigate to="/auth" />}
            />
            <Route
              path="/auth"
              element={!user ? <AuthPage /> : <Navigate to="/" />}
            />
            <Route
              path="/update"
              element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
            />
            <Route path="/login" element={<LoginCard />} />
            <Route
              path="/:username"
              element={
                user ? (
                  <>
                    {" "}
                    <UserPage /> <CreatePost />{" "}
                  </>
                ) : (
                  <UserPage />
                )
              }
            />
            <Route path="/:username/post/:pid" element={<PostPage />} />
            <Route
              path="/chat"
              element={user ? <ChatPage /> : <Navigate to={"/auth"} />}
            />
          </Routes>
        </Flex>
      </Container>
    </Box>
  );
}

export default App;
