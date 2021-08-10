const options = new Map<string, object>()

options.set('default', { algorithm: 'HS256', expiresIn: '15min' })
options.set('userToken', { algorithm: 'HS256', expiresIn: '2h' })

export default options
