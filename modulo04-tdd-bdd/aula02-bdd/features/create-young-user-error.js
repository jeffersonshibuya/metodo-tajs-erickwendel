import {BeforeStep, When, Given, Then} from '@cucumber/cucumber'

let _testServerAddress = ''

// BeforeStep(function() {
//     _testServerAddress = this.testServerAddress
// })

When('I create a new user with the following details:', async function(dataTable) {
    const [data] = dataTable.hashes()
    const response = await createUser(data)
    assert.strictEqual(response.status, 201)
    _context.userData = await response.json()
    assert.ok(_context.userData.id)
})
// Then('I should receive an error message that the user must be at least 18 years old', async function() {
    
// })