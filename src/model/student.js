import {Schema, model} from "mongoose";

const studentSchema = new Schema({
    _id: {type: Number},
    name: {type: String},
    password: {type: String, required: true},
    scores: {
        type: Map,
        key: String,
        of: Number,
        default: {}
    }
}, {
    versionKey: false,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = doc._id;
            delete ret._id;
        }
    }
});

const Student = model("student", studentSchema, 'college');

export default Student;