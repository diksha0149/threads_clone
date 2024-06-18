import { useState } from "react"
import useShowToast from "./useShowToast"

const usePreviewImg = () => {
    const [imgUrl,setImgUrl] = useState(null)
    const showToast = useShowToast()

    const handleImgChange=(e)=>{
        const file = e.target.files[0];
        console.log(file);
        if(file && file.type.startsWith("image/")){
            const reader = new FileReader();

            reader.onloadend = () =>{
                //holds the result of the file reading operation
                // the result attribute contains the data as a data: URL representing the file's data as a base64 encoded string.
                setImgUrl(reader.result);
            }
            // It reads the content of the specified file and converts it to a data URL representing the file's data. The data URL can be used directly as the src attribute of an <img> tag to display the image represented by the file.
            reader.readAsDataURL(file);
        }
        else{
            showToast("Invalid File Type","Please select an Image Type","error")
            setImgUrl(null);
        }
        // console.log(imgUrl);
    }
    return {handleImgChange, imgUrl,setImgUrl}
}

export default usePreviewImg
