import { requiredChakraThemeKeys } from '@chakra-ui/react'
import mongoose from 'mongoose'

const postSchema = mongoose.Schema({
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text:{
        type: String,
        maxLength: 500
    },
    img:{
        type: String,
    },
    likes:{
        // array of users id
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: "User"
    },
    replied: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            text:{
                type: String,
                required: true,
            },
            userProfilePic:{
                type: String,
            },
            username:{
                type: String,
            }
        }
    ]
},{
    timestamps: true
})

const Post = mongoose.model('Post', postSchema);

export default Post