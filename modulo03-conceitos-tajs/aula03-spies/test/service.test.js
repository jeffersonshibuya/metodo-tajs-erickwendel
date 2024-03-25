import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import Service from '../src/service.js'
import fs from 'node:fs/promises'
import crypto from 'node:crypto'

describe('Service Test Suite', () => {
    let _service
    const filename = 'testfile.ndjson'
    const MOCKED_HASH_PWD = 'hashedpassword'

    describe('#create - spies', () => {
        beforeEach(() => {
            jest
                .spyOn(crypto, crypto.createHash.name)
                .mockReturnValue({
                    update: jest.fn().mockReturnThis(),
                    digest: jest.fn().mockReturnValue(MOCKED_HASH_PWD)
                })
            
            jest
                .spyOn(fs, fs.appendFile.name)
                .mockResolvedValue()

            _service = new Service({filename})
        })

        it('should call appendFile with right params', async () => {
            // Arrange
            const exptectedCreatedAt = new Date().toISOString()
            const input = {
                username: 'usertest',
                password: 'mypass'
            }
            jest.spyOn(Date.prototype, Date.prototype.toISOString.name).mockReturnValue(exptectedCreatedAt)

            // Act
            await _service.create(input)
            
            // Assert
            expect(crypto.createHash).toHaveBeenCalledWith('sha256')
            
            const hash = crypto.createHash('sha256')
            expect(hash.update).toHaveBeenCalledWith(input.password)
            expect(hash.digest).toHaveBeenCalledWith('hex')

            const expected = JSON.stringify({
                ...input,
                createdAt: exptectedCreatedAt,
                password: MOCKED_HASH_PWD
            }).concat('\n')
            expect(fs.appendFile).toHaveBeenCalledWith(filename, expected)
        })
    })
})