import { Client, Account, Databases } from 'appwrite'

const client = new Client()
client
    .setEndpoint('https://syd.cloud.appwrite.io/v1')
    .setProject('hedge')

export const account = new Account(client)
export const databases = new Databases(client)