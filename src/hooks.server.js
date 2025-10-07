import { account } from '$lib/appwrite'
// @ts-ignore
import { redirect } from '@sveltejs/kit'

// @ts-ignore
export const handle = async ({ event, resolve }) => {
    try {
        const session = await account.get()
        // @ts-ignore
        event.locals.user = session 
    } catch {
        // @ts-ignore
        event.locals.user = null 
    }

    return resolve(event)
}