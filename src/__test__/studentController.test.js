import { jest } from '@jest/globals';

const mockService = {
    addStudent: jest.fn(),
    findStudent: jest.fn(),
    deleteStudent: jest.fn(),
    updateStudent: jest.fn(),
    addScore: jest.fn(),
    findStudentsByName: jest.fn(),
    countStudentsByName: jest.fn(),
    findStudentsByMinScore: jest.fn(),
};

// Mocking the studentService module
jest.unstable_mockModule('../service/studentService.js', () => mockService);

// Importing app and request after mocking the service
const express = (await import('express')).default;
const studentRoutes = (await import('../routes/studentRoutes.js')).default;
const request = (await import('supertest')).default;

const app = express();
app.use(express.json());
app.use(studentRoutes);

describe('Student Controller Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /student', () => {
        it('should return 204 when student is added successfully', async () => {
            // Arrange
            const studentData = { id: 1, name: 'John Doe', password: 'password123' };
            mockService.addStudent.mockResolvedValue(true);

            // Act
            const response = await request(app)
                .post('/student')
                .send(studentData);

            // Assert
            expect(response.status).toBe(204);
            expect(mockService.addStudent).toHaveBeenCalledWith(studentData);
        });

        it('should return 400 when validation fails', async () => {
            // Arrange
            const invalidData = { id: 'invalid', name: 'John Doe' }; // missing password and invalid id type

            // Act
            const response = await request(app)
                .post('/student')
                .send(invalidData);

            // Assert
            expect(response.status).toBe(400);
            expect(mockService.addStudent).not.toHaveBeenCalled();
        });

        it('should return 409 when student already exists', async () => {
            // Arrange
            const studentData = { id: 1, name: 'John Doe', password: 'password123' };
            mockService.addStudent.mockResolvedValue(false);

            // Act
            const response = await request(app)
                .post('/student')
                .send(studentData);

            // Assert
            expect(response.status).toBe(409);
        });
    });

    describe('GET /student/:id', () => {
        it('should return 200 and student data when found', async () => {
            // Arrange
            const student = { _id: 1, name: 'John Doe' };
            mockService.findStudent.mockResolvedValue(student);

            // Act
            const response = await request(app).get('/student/1');

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toEqual(student);
            expect(mockService.findStudent).toHaveBeenCalledWith('1');
        });

        it('should return 404 when student is not found', async () => {
            // Arrange
            mockService.findStudent.mockResolvedValue(null);

            // Act
            const response = await request(app).get('/student/999');

            // Assert
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Student with id 999 not found');
        });
    });

    describe('DELETE /student/:id', () => {
        it('should return 200 and deleted student when successful', async () => {
            // Arrange
            const student = { _id: 1, name: 'John Doe' };
            mockService.deleteStudent.mockResolvedValue(student);

            // Act
            const response = await request(app).delete('/student/1');

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toEqual(student);
        });

        it('should return 404 when student to delete is not found', async () => {
            // Arrange
            mockService.deleteStudent.mockResolvedValue(null);

            // Act
            const response = await request(app).delete('/student/999');

            // Assert
            expect(response.status).toBe(404);
        });
    });

    describe('PATCH /student/:id', () => {
        it('should return 200 and updated student when successful', async () => {
            // Arrange
            const updateData = { name: 'Jane Doe' };
            const updatedStudent = { _id: 1, name: 'Jane Doe' };
            mockService.updateStudent.mockResolvedValue(updatedStudent);

            // Act
            const response = await request(app)
                .patch('/student/1')
                .send(updateData);

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedStudent);
            expect(mockService.updateStudent).toHaveBeenCalledWith('1', updateData);
        });

        it('should return 400 when validation fails', async () => {
            // Arrange
            const invalidData = { name: 123 }; // name should be string

            // Act
            const response = await request(app)
                .patch('/student/1')
                .send(invalidData);

            // Assert
            expect(response.status).toBe(400);
        });

        it('should return 404 when student to update is not found', async () => {
            // Arrange
            mockService.updateStudent.mockResolvedValue(null);

            // Act
            const response = await request(app)
                .patch('/student/999')
                .send({ name: 'Jane Doe' });

            // Assert
            expect(response.status).toBe(404);
        });
    });

    describe('PATCH /score/student/:id', () => {
        it('should return 204 when score is added successfully', async () => {
            // Arrange
            const scoreData = { examName: 'Math', score: 95 };
            mockService.addScore.mockResolvedValue(true);

            // Act
            const response = await request(app)
                .patch('/score/student/1')
                .send(scoreData);

            // Assert
            expect(response.status).toBe(204);
            expect(mockService.addScore).toHaveBeenCalledWith('1', 'Math', 95);
        });

        it('should return 400 when score validation fails', async () => {
            // Arrange
            const invalidScore = { examName: 'Math', score: 101 }; // score max is 100

            // Act
            const response = await request(app)
                .patch('/score/student/1')
                .send(invalidScore);

            // Assert
            expect(response.status).toBe(400);
        });

        it('should return 404 when student for score is not found', async () => {
            // Arrange
            mockService.addScore.mockResolvedValue(false);

            // Act
            const response = await request(app)
                .patch('/score/student/999')
                .send({ examName: 'Math', score: 95 });

            // Assert
            expect(response.status).toBe(404);
        });
    });

    describe('Other query endpoints', () => {
        it('GET /students/name/:name should return students list', async () => {
            const students = [{ name: 'Eva' }];
            mockService.findStudentsByName.mockResolvedValue(students);

            const response = await request(app).get('/students/name/Eva');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(students);
            expect(mockService.findStudentsByName).toHaveBeenCalledWith('Eva');
        });

        it('GET /quantity/students/ should return count', async () => {
            mockService.countStudentsByName.mockResolvedValue(5);

            const response = await request(app).get('/quantity/students/?names=Ann&names=Bob');

            expect(response.status).toBe(200);
            expect(response.body).toBe(5);
            expect(mockService.countStudentsByName).toHaveBeenCalledWith(['Ann', 'Bob']);
        });

        it('GET /students/exam/:exam/minscore/:minScore should return students', async () => {
            const students = [{ name: 'John', scores: { Math: 90 } }];
            mockService.findStudentsByMinScore.mockResolvedValue(students);

            const response = await request(app).get('/students/exam/Math/minscore/80');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(students);
            expect(mockService.findStudentsByMinScore).toHaveBeenCalledWith('Math', '80');
        });
    });
});
