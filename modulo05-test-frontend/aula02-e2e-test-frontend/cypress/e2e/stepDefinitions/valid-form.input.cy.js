import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { registerForm } from "./../common/registerForm.cy.js";

Then('I should see a check icon in the title field', () => {
    registerForm.elements.titleInput().should('not.have.attr', 'required')
})

Then('The inputs should be cleared', (text) => {
  registerForm.elements.titleInput().should('have.value', '')
  registerForm.elements.imageUrlInput().should('have.value', '')
})