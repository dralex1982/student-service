import * as service from "../service/studentService.js";
import {addStudentSchema, scoreSchema, updateStudentSchema} from "../validator/studentValidator.js";

export const addStudent = async (req, res) => {
    const {error} = addStudentSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const success = await service.addStudent(req.body);
    if (success) {
        return res.status(204).send();
    } else {
        return res.status(409).send()
    }
}

export const findStudent = async (req, res) => {
    const student = await service.findStudent(req.params.id);

    if (student) {
        return res.json(student);
    } else {
        return res.status(404).send(
            {
                "timestamp": new Date().toISOString(),
                "status": 404,
                "error": "Not Found",
                "message": `Student with id ${req.params.id} not found`,
                "path": req.path
            }
        );
    }
}

export const deleteStudent = async (req, res) => {
    const student = await service.deleteStudent(req.params.id);
    if (student) {
        return res.json(student);
    } else {
        return res.status(404).send(
            {
                "timestamp": new Date().toISOString(),
                "status": 404,
                "error": "Not Found",
                "message": `Student with id ${req.params.id} not found`,
                "path": req.path
            }
        )
    }
}

export const updateStudent = async (req, res) => {
    const {error} = updateStudentSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const data = req.body;
    const student = await service.updateStudent(req.params.id, data);
    if (student) {
        return res.json(student);
    } else {
        return res.status(404).send(
            {
                "timestamp": new Date().toISOString(),
                "status": 404,
                "error": "Not Found",
                "message": `Student with id ${req.params.id} not found`,
                "path": req.path
            }
        )
    }
}

export const addScore = async (req, res) => {
    const {error} = scoreSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const {examName, score} = req.body ?? {};
    const success = await service.addScore(req.params.id, examName, score);
    if (success) {
        return res.status(204).send();
    } else {
        return res.status(404).send(
            {
                "timestamp": new Date().toISOString(),
                "status": 404,
                "error": "Not Found",
                "message": `Student with id ${req.params.id} not found`,
                "path": req.path
            }
        )
    }
}

export const findByName = async (req, res) => {
    const students = await service.findStudentsByName(req.params.name);
    return res.json(students);
}

export const countByName = async (req, res) => {
    const countStudents = await service.countStudentsByName(req.query.names);
    return res.json(countStudents);
}

export const findByMinScore = async (req, res) => {

    const {exam, minScore} = req.params;
    const students = await service.findStudentsByMinScore(exam, minScore);
    return res.json(students);
}

