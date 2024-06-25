import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

const useGetUserProfile = () => {
    const {username} = useParams();
    const [loading,setLoading] = useState(true);
    const [user,setUser] = useState(null)
    const showToast = useShowToast()

  useEffect(()=>{
    const getUser = async () =>{
        try {
            const res = await fetch(`/api/users/profile/${username}`);
            const data = await res.json();
            if(data.error){
                showToast("Error",data.error,"error");
                return ;    
            }
            setUser(data);
            
        } catch (error) {
            showToast("Error",error,"error");
        }finally{
            setLoading(false);
        }
    }
    
    getUser();
  },[username])

  return {loading,user};
}

export default useGetUserProfile
