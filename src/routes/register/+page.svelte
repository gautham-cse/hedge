<svelte:head>
    <title> {'Register'} </title>
</svelte:head>

<script>
    // @ts-nocheck
    // svelte-carbondesign-system
    import '../styles/root.css'
    import 'carbon-components-svelte/css/all.css'
    import { ChevronRight, Beta } from 'carbon-icons-svelte'
    import { 
        Link,
        Theme,
        Modal,
        Button,
        Loading,
        FluidForm,
        TextInput,
        RadioButton,
        OutboundLink,
        PasswordInput,
        RadioButtonGroup,
        ToastNotification,
    } from 'carbon-components-svelte'    

    // hedge-authentication
    import { user } from '$lib/user'
    import { onMount } from 'svelte'
    import { goto } from '$app/navigation'
    import { account } from '$lib/appwrite'
    import { fade } from 'svelte/transition'

    // hedge-constraints
    let timeout = undefined
    let open = false
    let app_name = ''
    let app_email = ''
    let app_password = ''
    let theme = "white"
    let isLoading = false
    let pageTitle = 'Register'
    let errorMessage = "Login failed. Please try again"
    let successMessage = "Account creation successsful"

    $: showErrNotification = timeout === 'error'
    $: showSuccNotification = timeout === 'success'

    function sanitizedUsername(username) {
        let sanitized = username.replace(/\s+/g,'_')
        sanitized = sanitized.replace(/[^a-zA-Z0-9_]/g, '')
        return sanitized
    }

    function validateUsername(username) {
        if (username.length < 7) {
            return `Username must be at least 7 characters long`
        }
        return username.match(/[^a-zA-Z0-9_]/) ? 'Username contains invalid characters' : ''
    }

    $: usernameError = validateUsername(app_name)

    //@ts-ignore
    const hedge_register = async (e) => {
        e.preventDefault()
        isLoading = true

        const name = sanitizedUsername(app_name) 

        if (!app_email || !app_password || !app_name) {
            isLoading = false 
            return
        }
        try {
            await user.register(app_email, app_password, name)
            await user.logout()
            successMessage = "Account created successfully"
            timeout = 'success'

            setTimeout(() => {
                timeout = undefined
            }, 2500)
            setTimeout(() => {
                goto('/')
            }, 3250)
        }
        catch(e) {
            errorMessage = e.message || "An unknown error occurred"
            timeout = 'error'

            setTimeout(() => {
                timeout = undefined
            }, 5000);
        }
        finally {
            isLoading = false
        }
    }

    /* onMount(() => {
        const urlParams = new URLSearchParams(window.location.search)        
        urlParams.set('engine', 'airbase')
        const _engineRxnx = Math.floor(Math.random() * 2) + 1
        urlParams.set('server', `${_engineRxnx}`)
        window.history.replaceState({}, '', '?' + urlParams.toString())
    }) */
</script>

<div class="App-Title"><h2>The Hedge <span style="font-size: 13px;">{' / '}{pageTitle}</span> </h2></div>
<div class="App-Theme"><Button kind="ghost" on:click={() => (open = true)}>Theme</Button></div>

<!-- hedge-theme-constraint -->
<Modal bind:open passiveModal modalHeading="App Theme">
    <Theme bind:theme persist persistKey="app_hedge-theme" />
    <RadioButtonGroup legendText="Select theme" bind:selected={theme}>
        {#each ["white", "g100"] as value}
            <RadioButton labelText={value} {value} />
        {/each}
    </RadioButtonGroup>
</Modal>

<!-- hedge-registration-form -->
<div class="App-Login--Flex">
    <div class="App-Login--Form">
        <FluidForm style="width: auto;" on:submit={hedge_register}>
            <div style="display: flex; justify-content: start;"> 
                <div>
                    <h1> {'Sign up'} </h1><br>
                    <div>Have an account? <Link inline href="/">Login</Link></div>
                </div>
            </div>
            <div style="margin-top: 25px; display: flex; justify-content: center;">
                <div>
                    <TextInput labelText="Username" style="width: 350px;" bind:value={app_name}  required />
                    <TextInput labelText="Email" style="width: 350px;" bind:value={app_email}  required />
                    <PasswordInput type="password" labelText="Password" bind:value={app_password} required />
                </div>
            </div>
            <div style="margin-top: 15px; width: auto; display: flex; justify-content: center;">
                <Button icon={ChevronRight} class="App-Login--Btn" style="margin-right: auto;" type="submit" disabled={isLoading}>
                    {#if isLoading}
                        <Loading withOverlay={false} small />
                    {:else}
                        {'Submit'}
                    {/if}
                </Button>
            </div>
        </FluidForm>
        <div style="margin-top: 15px; width: auto; display: flex; justify-content: start; width: auto;">
            <!-- <Link size="sm" href="/"></Link> -->
        </div>
    </div>
</div>

<!-- hedge-copyright -->
<div style="position: fixed; bottom: 0; margin: 12px;">
    <p style="font-size: 12px; margin-left: 32px;"></p>
</div>

<!-- hedge-authconfig-error -->
{#if showErrNotification}
  <div transition:fade>
    <ToastNotification
      class="appErrNotification"
      timeout = {5000}
      kind="error"
      title="Failed to register"
      subtitle={errorMessage}
      caption={new Date().toLocaleString()}
      on:close={(e) => {
        timeout = undefined;
        console.log(e.detail.timeout);
      }}
    />
  </div>
{/if}

<!-- hedge-authconfig-success -->
{#if showSuccNotification}
  <div transition:fade>
    <ToastNotification
      class="appErrNotification"
      timeout = {timeout}
      kind="success"
      title="Successfull"
      subtitle={successMessage}
      caption={new Date().toLocaleString()}
      on:close={(e) => {
        timeout = undefined;
        console.log(e.detail.timeout);
      }}
    />
  </div>
{/if}