export const { data, footer, login, register_news, response } = {

    data: {

        host: location.hostname || 'localhost',
        port: '8080',
        attempts: 5,
        attemptsReset: 180000,
        model: {
            content: 'news',
            user: 'users'
        },
        find: {
            sort: '-createdAt',
            limit: 20
        }
    },

    footer: {

        dev: '©2022 IsaqueDev',
        href: 'https://github.com/isaque-developer',
        links: [
            {
                href: 'https://github.com/isaque-developer',
                name: 'GitHub'
            }, {
                href: 'https://www.linkedin.com/in/isaque-mascarello-982678254',
                name: 'LinkedIn'
            }, {
                href: 'https://hub.docker.com/u/isaquedeveloper',
                name: 'Docker'
            }, {
                href: 'https://codepen.io/isaque-developer',
                name: 'CodePen'
            }
        ]
    },

    login: {

        password_max_length: 20,
        password_min_length: 6,
        user_max_length: 75,
        user_min_length: 6
    },

    register_news: {

        content: 10000,
        min_length: 3,
        synopsis: 200
    },

    response: {
        
        message_time: 2000
    }
}