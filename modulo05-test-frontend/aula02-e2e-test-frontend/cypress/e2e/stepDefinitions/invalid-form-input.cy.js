import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { colors, registerForm } from "./../common/registerForm.cy.js";
import assert from 'assert'

Then('I should see {string} message above the title field', (text) => {
  registerForm.elements.titleFeedback().should('contain.text', text)
})

Then('I should see {string} message above the imageUrl field', (text) => {
    registerForm.elements.imageUrlFeedback().should('contain.text', text)
})

Then('I should see an exclamation icon in the title and URL fields', () => {
    // registerForm.elements.titleInput().should('have.attr', 'required')
    registerForm.elements.titleInput().should(([element]) => {
        const styles = window.getComputedStyle(element)
        const border = styles.getPropertyValue('border-right-color')
        assert.strictEqual(border, colors.errors)
    })
})