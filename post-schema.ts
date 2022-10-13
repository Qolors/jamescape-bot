import mongoose from "mongoose";


const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    }
})

export default mongoose.model('posts', schema);