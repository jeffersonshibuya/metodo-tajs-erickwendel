import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
import { createServer } from 'node:http'
const usersDb = []


function getUserCategory(birthDay) {
    const age = new Date().getFullYear() - new Date(birthDay).getFullYear()
    if (age < 18) {
        throw new Error('User must be 18yo or older')
    }

    if (age >= 18 && age <= 25) {
        return 'young-adult'
    }

    if(age >= 26 && age <= 50) {
        return 'adult'
    }

    if(age >= 51) {
        return 'senior'
    }
    
    throw new Error()

}

const server = createServer(async (request, response) => {
    try {
        if(request.url === '/users' && request.method === 'POST') {
            const user = JSON.parse(await once(request, 'data'))
            const updatedUser = {
                ...user,
                id: randomUUID(),
                category: getUserCategory(user.birthDay)
            }
            usersDb.push(updatedUser)
            response.writeHead(201, {
                'Content-Type': 'application/json'
            })
            return response.end(JSON.stringify({
                id: updatedUser.id
            }));
        }
    
        if (request.url.startsWith('/users') && request.method === 'GET') {
            const [, , id] = request.url.split('/')
            const user = usersDb.find(user => user.id === id)
            return response.end(JSON.stringify(user))
        }
    } catch (error) {
        if(error.message.includes('18yo')) {
            response.writeHead(400, {
                'Content-Type': 'application/json'
            })

            return response.end(JSON.stringify({
                message: error.message
            }))
        }
        console.log(error)
        response.writeHead(500)
        response.end('Deu ruim!')
    }
    response.end()
})

export { server }