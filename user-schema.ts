import mongoose from "mongoose";


const schema = new mongoose.Schema({
    account: {
        type: String,
        required: true
    }
})

export default mongoose.model('account', schema);