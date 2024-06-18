import { useParams } from "react-router-dom";
import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"
import { useState, useEffect } from "react";
import useShowToast from "../hooks/useShowToast"
import { Spinner } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/layout"
import Post from "../components/Post.jsx";
import useGetUserProfile from "../hooks/useGetUserProfile.js";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom.js";


const UserPage = () => {
  const [posts,setPosts] = useRecoilState(postsAtom)
  const {username} = useParams();
  const showToast = useShowToast();
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const {user,loading} = useGetUserProfile();
  console.log(user);
  useEffect(()=>{
    
    const getPosts = async ()=>{
      setFetchingPosts(true);
      try{
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        // console.log(data);
        setPosts(data);
      }catch(error){
        showToast("Error",error.message,"error");
        setPosts([]);
      }finally{
        setFetchingPosts(false);
      }
    }

    getPosts();
  },[username,useShowToast]);

 console.log("posts is here and it is recoil state ", posts);

  if(!user && loading){
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl"/>
      </Flex>
    )
  }
  if(!user && !loading){
    return <h1>User Not Found</h1>
  }

  if(!user) return null;
  return (
    <>
      <UserHeader user = {user} isLoading={loading}/>
      {!fetchingPosts && posts.length === 0 && <h1>User has no posts</h1>}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"}/>
        </Flex>
      )}
      {posts.map((post)=> (
        <Post key={post._id} post={post} postedBy = {post.postedBy}/>
      ))}
    </>
  )
}

export default UserPage
