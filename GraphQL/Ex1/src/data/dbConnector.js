import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/contacts', {
    useNewUrlParser: true,
});

const contactSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String    
    },
    email: {
        type: String
    },
    company: {
        type: String
    }
});

const Contacts = mongoose.model('contacts', contactSchema);
export { Contacts };