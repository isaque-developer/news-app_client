export const render = {}

export default ({ error, type, response }) => {

    switch ( type ) {

        case 'create':

            type = 'registernews'
            break

        case 'create-user':

            type = 'login'
            break

        case 'find':

            type = 'news'
            break

        case 'find-id':

            type = 'headline'
            break

        case 'find-list':

            type = 'list'
            break
    }

    return render[ type || location.pathname.split('/')[1] || 'news' ]({ error, response })
}