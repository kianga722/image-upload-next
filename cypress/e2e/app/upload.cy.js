import { MAX_THUMBNAIL_KEYS } from '../../../src/app/utils/CONSTANTS';

const sizes = ['iphone-6', [1024, 768]]

describe('Image Gallery Mobile and Desktop', () => {
    sizes.forEach((size) => {
        it('allows photo uploads', () => {
            cy.visit('http://localhost:3000')
            if (Cypress._.isArray(size)) {
                cy.viewport(size[0], size[1])
            } else {
                cy.viewport(size)
            }

            cy.get('ul li').should('have.length', MAX_THUMBNAIL_KEYS)

            cy.get('dialog input[type="file"]').should('not.exist')
            cy.get('dialog form img').should('not.exist')
            cy.get('dialog .success').should('not.exist')

            cy.get('header button').click()

            cy.get('dialog input[type="file"]').should('exist')

            // Select fixture file
            const fileName = 'test.jpg'

            cy.get('dialog input[type="file"]').selectFile(`cypress/fixtures/${fileName}`)

            cy.get('dialog form img').should('exist')

            // Upload
            cy.get('dialog form button').click()

            cy.get('dialog .success').should('exist')

            // Confirm success message
            cy.get('dialog .success+button').click()

            // Form reset
            cy.get('dialog .success').should('not.exist')
            cy.get('dialog form img').should('not.exist')

            // Close by clicking outside modal
            cy.get('body').click(0,0)
    
            cy.get('dialog input[type="file"]').should('not.exist')
        })


        it('rejects files that are not images', () => {
            cy.visit('http://localhost:3000')
            if (Cypress._.isArray(size)) {
                cy.viewport(size[0], size[1])
            } else {
                cy.viewport(size)
            }

            cy.get('ul li').should('have.length', MAX_THUMBNAIL_KEYS)

            cy.get('dialog input[type="file"]').should('not.exist')
            cy.get('dialog form img').should('not.exist')
            cy.get('dialog .success').should('not.exist')

            cy.get('header button').click()

            cy.get('dialog input[type="file"]').should('exist')

            // Select fixture file
            const fileName = 'test.txt'

            cy.get('dialog input[type="file"]').selectFile(`cypress/fixtures/${fileName}`)

            cy.get('dialog .error').should('include.text','Selected file is not an image')

            cy.get('dialog form img').should('not.exist')
            // Submit button should disappear
            cy.get('dialog form button').should('not.exist')
        })


        it('rejects files that are too large', () => {
            cy.visit('http://localhost:3000')
            if (Cypress._.isArray(size)) {
                cy.viewport(size[0], size[1])
            } else {
                cy.viewport(size)
            }

            cy.get('ul li').should('have.length', MAX_THUMBNAIL_KEYS)

            cy.get('dialog input[type="file"]').should('not.exist')
            cy.get('dialog form img').should('not.exist')
            cy.get('dialog .success').should('not.exist')

            cy.get('header button').click()

            cy.get('dialog input[type="file"]').should('exist')

            // Select fixture file
            const fileName = 'largefile.jpg'

            cy.get('dialog input[type="file"]').selectFile(`cypress/fixtures/${fileName}`)

            cy.get('dialog .error').should('include.text','File size is too large')

            cy.get('dialog form img').should('not.exist')
            // Submit button should disappear
            cy.get('dialog form button').should('not.exist')
        })


        it('allow user to switch images before uploading', () => {
            cy.visit('http://localhost:3000')
            if (Cypress._.isArray(size)) {
                cy.viewport(size[0], size[1])
            } else {
                cy.viewport(size)
            }

            cy.get('ul li').should('have.length', MAX_THUMBNAIL_KEYS)

            cy.get('dialog input[type="file"]').should('not.exist')
            cy.get('dialog form img').should('not.exist')
            cy.get('dialog .success').should('not.exist')

            cy.get('header button').click()

            cy.get('dialog input[type="file"]').should('exist')

            // Select fixture file
            const fileName = 'test.jpg'
            const fileName2 = 'test2.jpg'
            const fileNameTxt = 'test.txt'

            cy.get('dialog input[type="file"]').selectFile(`cypress/fixtures/${fileName}`)

            cy.get('dialog form img').should('exist')
            cy.get('dialog form button').should('exist')

            let imgSrcFirst;
            cy.get('dialog form img').invoke('attr', 'src').then((src) => {
                imgSrcFirst = src
            })

            // Switch images
            cy.get('dialog input[type="file"]').selectFile(`cypress/fixtures/${fileName2}`)

            cy.get('dialog form img').invoke('attr', 'src').then((src) => {
                expect(src).to.not.equal(imgSrcFirst)
            });

            cy.get('dialog form button').should('exist')

            // Switching to a file that is not an image or file that is too large will not allow submission
            cy.get('dialog input[type="file"]').selectFile(`cypress/fixtures/${fileNameTxt}`)

            cy.get('dialog .error').should('include.text','Selected file is not an image')

            cy.get('dialog form button').should('not.exist')

            // Switching back to an appropriate image file should allow submission again
            cy.get('dialog input[type="file"]').selectFile(`cypress/fixtures/${fileName}`)

            cy.get('dialog form img').should('exist')
            cy.get('dialog form button').should('exist')
        })
    })
})