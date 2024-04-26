class RegisterForm {
    elements = {
        titleInput: () => cy.get('#title'),
        titleFeedback: () => cy.get('#titleFeedback'),

        imageUrlInput: () => cy.get('#imageUrl'),
        imageUrlFeedback: () => cy.get('#urlFeedback'),

        submitBtn: () => cy.get('#btnSubmit'),
    }

    typeText(text) {
        if(!text) return
        this.elements.titleInput().type(text)
    }
    typeUrl(text) {
        if(!text) return
        this.elements.imageUrlInput().type(text)
    }
    clickSubmit() {
        this.elements.submitBtn().click()
    }
}

export const registerForm = new RegisterForm()

export const colors = {
    errors: "rgb(221, 123, 134)",
    success: ''
}