import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { mapPerson } from '../src/person.js';

describe('Person Test Suite', () => {
    describe('#Happy path', () => {
        it('should map person given a valid JSON string', () => {
            const person = { name: 'Ze Da Manga', age: 45 }
            const personFormatted = mapPerson(JSON.stringify(person))
       
            const expected = {
                ...personFormatted,
                createdAt: expect.any(Date)
            }
            expect(personFormatted).toEqual(expected)
    
        })
    })

    describe('#What coverate does not tell you', () => {
        it('should not map person given invalid JSON string', () => {
            const personStr = '{"name":'
            expect(() => mapPerson(personStr)).toThrow('Unexpected end of JSON input')
        })
        it('should not map person given invalid JSON data', () => {
            const personStr = '{}'
            const personObj = mapPerson(personStr)
            expect(personObj).toEqual({
                name: undefined,
                age: undefined,
                createdAt: expect.any(Date)
            })
        })
    })
})