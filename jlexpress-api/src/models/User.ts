import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    }
});

export default mongoose.model('User', UserSchema);