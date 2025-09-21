import { writable } from "svelte/store";
import { ID } from 'appwrite'

import { goto } from "$app/navigation";
import { account } from "./appwrite";

const isBrowser = typeof window !== 'undefined'

const createUser = () => {
    const store = writable(null)

    async function init() {
        if (!isBrowser) return
        try {
            // @ts-ignore
            store.set(await account.get())
        }
        catch(e) {
            store.set(null)
        }
    }

    init()

    /**
     * @param {string} email
     * @param {string} password
     * @param {any} name
     */
    async function register(email, password, name) {
        if (!isBrowser) return
        await account.create({
            userId: ID.unique(), 
            email, 
            password, 
            name
        })
        await login(email, password)
    }

    /**
     * @param {string} email
     * @param {string} password
     */
    async function login(email, password) {
        if (!isBrowser) return
        await account.createEmailPasswordSession({
            email,
            password
        })
        await init()
        goto('/')
    }

    async function logout() {
        await account.deleteSession({
            sessionId: 'current'
        })
        store.set(null)
    }

    return {
        subscribe: store.subscribe,
        register,
        login,
        logout,
        init 
    }
}

export const user = createUser()
export const logout = user.logout