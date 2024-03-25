import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import Service from '../src/service.js'
import fs from 'node:fs/promises'
import fsSync from 'node:fs'

describe('Service Test Suite', () => {
    let _service
    const filename = 'testfile.ndjson'

    beforeEach(() => {
        _service = new Service({filename})
    })

    describe('#read', () => {
        it('should return a empty array if the file is empty', async () => {
            jest.spyOn(fs, fs.readFile.name).mockResolvedValue('')

            const result = await _service.read()
            expect(result).toEqual([])
        }),
        it('should return users without password if files exists and contains users ', async () => {
            const dbData = [
                {
                    username:"user1",
                    password:"pass1",
                    createdAt: new Date().toISOString()
                },
                {
                    username:"user2",
                    password:"pass2",
                    createdAt: new Date().toISOString()
                }
            ]

            const fileContents = dbData.map(item => JSON.stringify(item).concat('\n')).join('\n')

            jest.spyOn(fs, "readFile").mockResolvedValue(fileContents)
            jest.spyOn(fsSync, "existsSync").mockResolvedValue(true)
            

            const result = await _service.read()
            expect(result).toEqual(dbData.map(({password, ...rest}) => ({...rest})))
        })
        it('should return a empty array if file does not exist', async () => {
            jest.spyOn(fsSync, "existsSync").mockReturnValue(false);
            const result = await _service.read();
            expect(result).toEqual([]);
        })
    })
})