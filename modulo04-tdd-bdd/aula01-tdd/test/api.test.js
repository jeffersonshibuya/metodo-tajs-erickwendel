import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals'
import { server } from '../src/api.js'
/**
 * -Deve cadastrar usuarios e definir uma categoria onde:
 *  - Jovens Adultos: 18-25
 *  - Adultos:        26-50
 *  - Idosos:         51+
 *  - Menor:          Estoura um error
 */

describe('API Users E2E Suite', () => {

    function waitForServerStatus(server) {
        return new Promise((resolve, reject) => {
            server.once('error', (error) => reject(error))
            server.once('listening', () => resolve())
        })
    }

    function createUser(data) {
        return fetch(`${_testServerAddress}/users`, {
            method: 'POST',
            body: JSON.stringify(data)
        })
    }

    async function findUserById(id) {
        const user = await fetch(`${_testServerAddress}/users/${id}`)
        return user.json()
    }

    let _testServer
    let _testServerAddress

    beforeAll(async () => {
        _testServer = server.listen();
        
        jest.useFakeTimers({
            now: new Date('2024-02-25T00:00')
        })

        await waitForServerStatus(_testServer)

        const serverInfo = _testServer.address()
        _testServerAddress = `http://localhost:${serverInfo.port}`
    })

    afterAll(done => {
        server.closeAllConnections()
        _testServer.close(done)
    })

    it('should register a new user with young-adult category', async () => {
        const expectedCategory = 'young-adult'
        const response = await createUser({
            name: 'Ze da Manga',
            birthday: '2000-01-01' // 25 anos
        })
        expect(response.status).toBe(201)
        const result = await response.json()
        expect(result.id).not.toBeUndefined()

        const user = await findUserById(result.id)
        expect(user.category).toBe(expectedCategory)
    })

    it('should register a new user with adult category', async () => {
        const expectedCategory = 'adult'
        const response = await createUser({
            name: 'Ze da Manga',
            birthday: '1990-01-01' // 34 anos
        })
        expect(response.status).toBe(201)
        const result = await response.json()
        expect(result.id).not.toBeUndefined()

        const user = await findUserById(result.id)
        expect(user.category).toBe(expectedCategory)
    })
    it('should register a new user with senior category', async () => {
        const expectedCategory = 'senior'
        const response = await createUser({
            name: 'Ze da Manga',
            birthday: '1970-01-01' // 64 anos
        })
        expect(response.status).toBe(201)
        const result = await response.json()
        expect(result.id).not.toBeUndefined()

        const user = await findUserById(result.id)
        expect(user.category).toBe(expectedCategory)
    })
    it('should throw an error when registering a under-age user', async () => {
        const response = await createUser({
            name: 'Ze da Manga',
            birthday: '2020-01-01' // 4 anos
        })
        expect(response.status).toBe(400)
        const result = await response.json()
        expect(result).toEqual({message: 'User must be 18yo or older'})
    })
    it('should throw an error if invalid values', async () => {
        const response = await createUser({
            name: 'Ze da Manga',
            birthday: 'invalid-value'
        })
        expect(response.status).toBe(500)
    })
})
