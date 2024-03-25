import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import Task from '../src/task.js';

describe('Task Test Suite', () => {
    let _logMock; 
    let _task
    
    beforeEach(() => {
        _logMock = jest
            .spyOn(console, console.log.name)
            .mockImplementation()
    
        _task = new Task()
    })

    it('should only run tasks that are due without fake timers (FAST)', async () => {
        jest.useFakeTimers()
        
        // Arrange
        const tasks = [
            {
                name: 'Task-Will-Run-In-5-Secs',
                dueAt: new Date(Date.now() + 5000), // 5 secs
                fn: jest.fn()
            },
            {
                name: 'Task-Will-Run-In-5-Secs',
                dueAt: new Date(Date.now() + 10000), // 10secs
                fn: jest.fn()
            },
        ]

        // Act
        _task.save(tasks.at(0))
        _task.save(tasks.at(1))
        
        _task.run(200)

        // Assertion

        // Ninguem deve ser executado ainda
        jest.advanceTimersByTime(4000)
        expect(tasks.at(0).fn).not.toHaveBeenCalled()
        expect(tasks.at(1).fn).not.toHaveBeenCalled()

        // Ninguem deve ser executado ainda - + 2seg
        jest.advanceTimersByTime(2000)
        expect(tasks.at(0).fn).toHaveBeenCalled()
        expect(tasks.at(1).fn).not.toHaveBeenCalled()

        // Ninguem deve ser executado ainda - + 4seg = Total = 10s
        jest.advanceTimersByTime(4000)
        expect(tasks.at(0).fn).toHaveBeenCalled()
        expect(tasks.at(1).fn).toHaveBeenCalled()

        // Volta a usar tempo real
        jest.useRealTimers()
    })
})