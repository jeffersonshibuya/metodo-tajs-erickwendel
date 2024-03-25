import {describe, it, expect, jest} from '@jest/globals'
import Person from '../src/person'

describe('#Person Suite', () => {
    describe('#validate', () => {
        it('should throw if name is not present', () => {
            const mockInvalidPerson = {
                name: '',
                cpf: '123.456.789-00'
            }

            expect(() => Person.validate(mockInvalidPerson))
                .toThrow(new Error('name is required'))
        })
        it('should throw if cpf is not present', () => {
            const mockInvalidPerson = {
                name: 'Ze da Manga'
            }
            expect(() => Person.validate(mockInvalidPerson)).toThrow('cpf is required')
        })
        it('should not throw if person is valid', () => {
            const mockInvalidPerson = {
                name: 'Ze da Manga',
                cpf: '123.456.789-00'
            }
            expect(() => Person.validate(mockInvalidPerson)).not.toThrow()
        })
    }),
    describe('#format', () => {
        it('should format the person name and CPF', () => {
            const mockPerson = {
                name: 'Ze da Manga',
                cpf: '123.456.789-00'
            }

            const personFormatted = Person.format(mockPerson)

            const expected = {
                name: 'Ze',
                lastName: 'da Manga',
                cpf: '12345678900'
            }
            expect(personFormatted).toStrictEqual(expected)
        })
    }),
    describe('#save', () => {
        it('should throw if name is not present', () => {
            const mockInvalidPerson = {
                lastName: 'da Manga',
                cpf: '12345678900'
            }
            expect(() => Person.save(mockInvalidPerson)).toThrow(`Cannot save invalid person ${JSON.stringify(mockInvalidPerson)}`)
        }),
        it('should throw if cpf is not present', () => {
            const mockInvalidPerson = {
                name: 'Ze',
                lastName: 'da Manga'
            }
            expect(() => Person.save(mockInvalidPerson)).toThrow(`Cannot save invalid person ${JSON.stringify(mockInvalidPerson)}`)
        }),
        it('should throw if lastName is not present', () => {
            const mockInvalidPerson = {
                name: 'Ze',
                cpf: '12345678900'
            }
            expect(() => Person.save(mockInvalidPerson)).toThrow(`Cannot save invalid person ${JSON.stringify(mockInvalidPerson)}`)
        }),
        it('should format if person is valid', () => {
            const consoleLogMock = jest.spyOn(global.console, 'log')

            const mockValidPerson = {
                name: 'Ze',
                lastName: 'da Manga',
                cpf: '12345678900'
            }
            expect(() => Person.save(mockValidPerson)).not.toThrow()
            expect(consoleLogMock).toHaveBeenCalledWith(`user registrado com sucesso`)
        })
    }),
    describe('#process', () => {
        it('should process a valid person', () => {
            // mock validate and format
            const mockPerson = {
                name: 'Ze da Manga',
                cpf: '123.456.789-00'
            }
    
            jest.spyOn(Person, Person.validate.name).mockReturnValue()
            jest.spyOn(Person, Person.format.name).mockReturnValue({
                name: 'Ze',
                lastName: 'da Manga',
                cpf: '12345678900'
            })
            const result = Person.process(mockPerson)
            expect(result).toStrictEqual('ok')
        })
    })
})