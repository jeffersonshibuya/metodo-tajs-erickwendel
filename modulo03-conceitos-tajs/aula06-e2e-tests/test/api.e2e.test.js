import { describe, jest, it, expect, beforeAll, afterAll } from '@jest/globals'
import Person from '../src/person.js'


function waitForServerStatus(server) {
    return new Promise((resolve, reject) => {
        server.once('error', (error) => reject(error))
        server.once('listening', () => resolve())
    })
}

describe('E2E Test Suite', () => {
    describe('E2E Test for Server in a anon-test env', () => {
        it('should start server with PORT 4000', async () => {
            const PORT = 4000
            process.env.NODE_ENV = 'production'
            process.env.PORT = PORT

            jest.spyOn(console, console.log.name)

            const { default: server } = await import('../src/index.js')
            await waitForServerStatus(server)

            const serverInfo = server.address()

            expect(serverInfo.port).toBe(4000)
            expect(console.log).toHaveBeenCalledWith(`server is running at ${serverInfo.address}:${serverInfo.port}`)

            return new Promise(resolve => server.close(resolve))
        })
    })

    describe('E2E Tests for Server', () => {
        let _testServer
        let _testServerAddress

        beforeAll(async () => {
            process.env.NODE_ENV = 'test'
            const {default: server} = await import('../src/index.js')
            _testServer = server.listen()

            await waitForServerStatus(_testServer)

            const serverInfo = _testServer.address()
            _testServerAddress = `http://localhost:${serverInfo.port}`

        })

        afterAll(done => _testServer.close(done))

        it('should return 404 for unsupported routes', async () => {
            const response = await fetch(`${_testServerAddress}/unsupported`, {
                method: 'POST'
            })
            expect(response.status).toBe(404)
        })

        it('should return 400 and missing field message when body is invalid', async () => {
            const response = await fetch(`${_testServerAddress}/persons`, {
                method: 'POST',
                body: JSON.stringify({
                    name: 'Ze da Manga',
                    cpf: ''
                })
            })
            expect(response.status).toBe(400)
            const data = await response.json()
            expect(data.validationError).toEqual('cpf is required')
        })

        it('should return 500 for unhandled errors', async () => {
            const response = await fetch(`${_testServerAddress}/persons`, {
                method: 'POST',
                body: JSON.stringify({
                    name: 'Ze da Manga',
                    cpf: 12345678900
                })
            })
            console
            expect(response.status).toBe(500)
            expect(console.log).toHaveBeenCalled()
        })
    })

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
                // const consoleLogMock = jest.spyOn(global.console, 'log')
    
                const mockValidPerson = {
                    name: 'Ze',
                    lastName: 'da Manga',
                    cpf: '12345678900'
                }
                expect(() => Person.save(mockValidPerson)).not.toThrow()
                expect(console.log).toHaveBeenCalledWith(`user registrado com sucesso`)
            })
        }),
        describe('#process', () => {
            it('should process a valid person', () => {
                // mock validate and format
                const mockPerson = {
                    name: 'Ze da Manga',
                    cpf: '123.456.789-00'
                }
        
                // jest.spyOn(Person, Person.validate.name).mockReturnValue()
                // jest.spyOn(Person, Person.format.name).mockReturnValue({
                //     name: 'Ze',
                //     lastName: 'da Manga',
                //     cpf: '12345678900'
                // })
                const result = Person.process(mockPerson)
                expect(result).toStrictEqual({"cpf": "12345678900", "lastName": "da Manga", "name": "Ze"})
            })
        })
    })
})
