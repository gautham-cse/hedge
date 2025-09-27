<script>
    // @ts-nocheck
    import './styles/root.css'
    import { onMount } from 'svelte'
    import 'carbon-components-svelte/css/all.css'
    import { ChevronLeft } from 'carbon-icons-svelte'
    import { Theme, Button } from 'carbon-components-svelte'
    import { goto } from '$app/navigation'

    let path = ""
    let theme = "g100" 

    onMount (async () => { 
        path = window.location.pathname; 
        await import ('carbon-components-svelte/css/all.css')
    })
</script>

<svelte:head>
    <title>{'Error:'}{path}</title>
</svelte:head>
<Theme bind:theme persist persistKey="app_hedge-theme" />

<div class="App-Err">
    <div>
        <h1>404, Page not found</h1><br>
        <p style="font-size: medium;">The requested page {path} was not found on the server</p><br><br>
        <Button kind="primary" icon={ChevronLeft} on:click={() => goto('/')}>Go back</Button>
    </div>
</div>

<style> .App-Err { width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; } </style>