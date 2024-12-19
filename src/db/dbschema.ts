import mongoose, { Schema, model } from 'mongoose';




const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true ,unique: true },

});

const tagSchema = new Schema({
    title: { type: String, required: true, unique: true },
});


const contenttype = ['link', 'video', 'audio', 'image', 'text','link','tweet','blog'];

//content schema
const contentSchema = new Schema({
    link: { type: String, required: true },
    type: { type: String, required: true, enum: contenttype },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags:[{ type: Schema.Types.ObjectId, ref: 'tag' }],
    date:Date,
    userid: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
});

const linkschema = new Schema({
    hash: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
});


//exporting scehmas
export const Usermodel = model('user', userSchema);
export const Tagmodel = model('tag', tagSchema);
export const Contentmodel = model('content', contentSchema);
export const Linkmodel = model('link', linkschema);