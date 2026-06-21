import {Router} from 'express';
import {
    addStudent,
    findStudent,
    deleteStudent,
    updateStudent,
    addScore,
    findStudentsByName,
    countStudentsByName,
    findStudentsByMinScore
} from "../controller/studentController.js";

const router = Router();

router.post("/student", addStudent);
router.get("/student/:id", findStudent);
router.delete("/student/:id", deleteStudent);
router.patch("/student/:id", updateStudent);
router.patch("/score/student/:id", addScore);
router.get("/students/name/:name", findStudentsByName);
router.get("/quantity/students", countStudentsByName);
router.get("/student/exam/:exam/minscore/:minScore", findStudentsByMinScore);

export default router;
