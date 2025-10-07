import { redirect } from '@sveltejs/kit'
import { account } from '$lib/appwrite'

export const load = async ({ locals }) => {
    // @ts-ignore
    if (locals.user) {
        throw redirect(302, '/')
    }

    try {
        const session = await account.get()
        if (session) throw redirect(302, '/')
    } 
    catch { }
}