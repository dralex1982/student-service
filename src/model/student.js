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
})

const Student = model("student", studentSchema, 'college');

export default Student;