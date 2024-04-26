import { describe, it, jest, expect } from '@jest/globals'
import View from '../../public/src/view'
describe('View test suite', () => {
    it('should initialized a form submit event listener', () => {
        const innerHTMLSpy = jest.fn()
        const baseHTML = `
            <form class="needs-validation">
                <input type="text"/>
                <button type="submit">Submit</button>
            </form>`
        
        const querySelectorProxy = new Proxy({
            innerHTML: baseHTML
        }, {
            set(obj, key, value) {
                obj[key] = value

                innerHTMLSpy(obj[key])
                
                return []
            }
        })

        jest.spyOn(document, document.querySelectorAll.name).mockImplementation((key) => {
            if(key !== '.needs-validation') return

            return querySelectorProxy
        })

        // const form = document.querySelector('.needs-validation');
        // const addEventListenerSpy = jest.spyOn(form, 'addEventListener');

        const view = new View()
        view.initialize()

        expect(innerHTMLSpy).toHaveBeenCalledWith()
    })

    it.skip('#updateList should append content to card-list innerHTML', () => {
        const innerHTMLSpy = jest.fn()
        const baseHTML = '<div></div>'
        const querySelectorProxy = new Proxy({
            innerHTML: baseHTML
        }, {
            set(obj, key, value) {
                obj[key] = value

                innerHTMLSpy(obj[key])
                
                return true
            }
        })

        jest.spyOn(document, document.querySelector.name).mockImplementation((key) => {
            if(key !== '#card-list') return

            return querySelectorProxy
        })

        const view = new View()
        const data = {
            title: 'title',
            imageUrl: 'https://img.com/img.png'
        }
        const generatedContent = `
        <article class="col-md-12 col-lg-4 col-sm-3 top-30">
                <div class="card">
                    <figure>
                        <img class="card-img-top card-img"
                            src="${data.imageUrl}"
                            alt="Image of an ${data.title}">
                        <figcaption>
                            <h4 class="card-title">${data.title}</h4>
                        </figcaption>
                    </figure>
                </div>
            </article>
        `
        view.updateList([data])
        
        expect(innerHTMLSpy).toHaveBeenNthCalledWith(1, baseHTML + generatedContent)

        view.updateList([data])
        expect(innerHTMLSpy).toHaveBeenNthCalledWith(2, baseHTML + generatedContent + generatedContent)
    })   
})