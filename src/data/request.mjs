import { send } from './getData.mjs'
import { data as config } from '../others/config.mjs'

export const fileToBase64 = file => new Promise( response => {

        const reader = new FileReader()
        reader.readAsDataURL( file )
        reader.onloadend = ({ target: { result }}) => response( result )
    })

export const getForm = e => {

    e.preventDefault()
    const form = e.target
    const data = [ ...( new FormData( form ))].reduce(( obj, [ key, val ]) => {
        if(( key == 'cover' || key == 'images' ) && val?.length == 0 ) return obj
        obj[ key ] = key == 'cover' || key == 'images' ? (
            key == 'cover' ? JSON.parse( val )?.img[0] : JSON.parse( val )?.img
        ) : val?.trim()
        return obj
    }, {})

    request( form.id, data )
}

export const getImages = arrFile => {

    if( !arrFile?.length ) return false

    const filterImages = [ ...arrFile ].filter(({ type }) => type.indexOf('image') == 0 )

    return Boolean( filterImages.length ) && filterImages.reduce( async ( arr, img ) => {

        const a = await arr
        a.push( await fileToBase64( img ))
        return a

    }, [])
}

export const request = ( type, data, options, field, by ) => {

    let { model, find } = config

    switch ( type ) {

        case 'find':

            data = [ data === undefined || data === null ? {} : field || {
                $or: [ 'title', 'category', 'content' ].reduce(( obj, key ) => {
                    obj.push({ [ key ]: { $regex: data, $options: 'i' }})
                    return obj
                }, [])
            }, options || null, find, by ]
            model = model.content

            break

        case 'find-id':

            model = model.content

            break

        case 'login':

            model = model.user

            break

        case 'register':

            model = model.user
            type = 'create'

            break

        case 'registernews':

            model = model.content
            type = 'create'

            break
    }

    send( type, model, data )
}