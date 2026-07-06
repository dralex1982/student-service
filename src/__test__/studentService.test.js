/*
The Arrange, Act, Assert (AAA) pattern in TDD unit testing involves three steps:
Arrange (setting up the test environment),
Act (executing the code under test),
and Assert (verifying the expected outcome).
This pattern helps in writing clear, maintainable, and effective unit tests.
*/
import {jest, beforeEach, describe, it, expect} from "@jest/globals"

const mockRepo = {
    createStudent: jest.fn(),
    findStudentById: jest.fn(),
    deleteStudent: jest.fn(),
    updateStudent: jest.fn(),
    findStudentsByName: jest.fn(),
    countStudentsByNames: jest.fn(),
    findStudentsByMinScore: jest.fn(),
}

jest.unstable_mockModule("../repository/studentRepository.js", () => mockRepo);

const studentService = await import("../service/studentService.js");

beforeEach(() => {
    jest.clearAllMocks();
})

describe("Student Service", () => {
    it('addStudent returns false when student already exists', async () => {
        // Arrange
        mockRepo.findStudentById.mockResolvedValue({id: 1});
        // Act
        const result = await studentService.addStudent({
            id: 1,
            name: 'John Doe',
            password: '1234'
        })
        // Assert
        expect(result).toBeFalsy();
        expect(mockRepo.createStudent).not.toHaveBeenCalled();
        expect(mockRepo.findStudentById).toHaveBeenCalledWith(1);
        expect(mockRepo.findStudentById).toHaveBeenCalledTimes(1);
    });
    it('addStudent returns true when student does not exist', async () => {
        // Arrange
        mockRepo.findStudentById.mockResolvedValue(null);
        // Act
        const result = await studentService.addStudent({
            id: 2,
            name: 'John Doe',
            password: '1234'
        })
        // Assert
        expect(result).toBeTruthy();
        expect(mockRepo.createStudent).toHaveBeenCalled();
        expect(mockRepo.createStudent).toHaveBeenCalledWith({
            _id: 2,
            name: 'John Doe',
            password: '1234'
        });
        expect(mockRepo.findStudentById).toHaveBeenCalledWith(2);
        expect(mockRepo.findStudentById).toHaveBeenCalledTimes(1);
    });
    it('findStudent delegates to repository', async () => {
        const student = {
            _id: 2,
            name: 'John Doe',
            password: '1234'
        }
        // Arrange
        mockRepo.findStudentById.mockResolvedValue(student);
        // Act
        const result = await studentService.findStudent(2)
        // Assert
        expect(result).toEqual(student);
        expect(mockRepo.findStudentById).toHaveBeenCalledWith(2);
        expect(mockRepo.findStudentById).toHaveBeenCalledTimes(1);
    });
    it('deleteStudent delegates to repository', async () => {
        const student = {
            _id: 3,
            name: 'John Doe',
            password: '1234'
        }
        // Arrange
        mockRepo.deleteStudent.mockResolvedValue(student);
        // Act
        const result = await studentService.deleteStudent(3)
        // Assert
        expect(result).toEqual(student);
        expect(mockRepo.deleteStudent).toHaveBeenCalledWith(3);
        expect(mockRepo.deleteStudent).toHaveBeenCalledTimes(1);
    });
    it('updateStudent returns updated student without scores', async () => {
        const toObject = jest.fn().mockResolvedValue({
            id: 3,
            name: 'John Doe',
            password: '1234'
        });
        // Arrange
        mockRepo.updateStudent.mockResolvedValue({toObject});
        // Act
        const result = await studentService.updateStudent(3, {name: 'John Doe'});
        // Assert
        expect(result).toEqual({
            id: 3,
            name: 'John Doe',
            password: '1234'
        });
        expect(toObject).toHaveBeenCalled();
        expect(toObject).toHaveBeenCalledTimes(1);
    });
    it('updateStudent returns undefined when student does not exist', async () => {
        // Arrange
        mockRepo.updateStudent.mockResolvedValue(null);
        // Act
        const result = await studentService.updateStudent(3, {name: 'John Doe'});
        // Assert
        expect(result).toBeUndefined();
    });
    it('addScore delegates to repository', async () => {
        const updated = {id:1}
        mockRepo.updateStudent.mockResolvedValue(updated);
        const result = await studentService.addScore(1, 'Math', 95);
        expect(result).toEqual(updated);
        expect(mockRepo.updateStudent).toHaveBeenCalledWith(1, {'scores.Math': 95});
    })
    it('findByName delegates to repository', async () => {
        const list = [{id:1, name: 'Eva'}]
        mockRepo.findStudentsByName.mockResolvedValue(list);
        const result = await studentService.findStudentsByName('Eva');
        expect(result).toEqual(list);
        expect(mockRepo.findStudentsByName).toHaveBeenCalledWith('Eva');
    })
    it('countByName delegates to repository', async () => {
        mockRepo.countStudentsByNames.mockResolvedValue(2);
        const result = await studentService.countStudentsByName(['Ann', 'Bob']);
        expect(result).toBe(2);
        expect(mockRepo.countStudentsByNames).toHaveBeenCalledWith(['Ann', 'Bob']);
    })
    it('findByMinScore delegates to repository', async () => {
        const list = [{id:1, scores: {Math:90}}]
        mockRepo.findStudentsByMinScore.mockResolvedValue(list);
        const result = await studentService.findStudentsByMinScore('Math', 80);
        expect(result).toEqual(list);
        expect(mockRepo.findStudentsByMinScore).toHaveBeenCalledWith('Math', 80);
    })
})