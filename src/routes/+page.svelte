<svelte:head>
    <title> {'Hedge'} </title>
</svelte:head>

<script>
    // @ts-nocheck
    // svelte-carbondesign-system
    import './styles/root.css'
    import 'carbon-components-svelte/css/all.css'
    import { ChevronRight } from 'carbon-icons-svelte'
    import { 
        Link,
        Theme,
        Modal,
        Button,
        Loading,
        FluidForm,
        TextInput,
        RadioButton,
        PasswordInput,
        RadioButtonGroup,
        ToastNotification,
    } from 'carbon-components-svelte'

    // hedge-authentication
    import { user } from '$lib/user'
    import { error } from '@sveltejs/kit'
    import { goto } from '$app/navigation'
    import { fade } from 'svelte/transition'
    import { preventDefault } from 'svelte/legacy'
    import { account } from '$lib/appwrite';
    import { onMount } from 'svelte';

    // hedge-constraints
    let open = false 
    let app_email = ''
    let app_password = ''
    let pageTitle = 'Login'
    let theme = "white"
    let isLoading = false
    let timeout = undefined
    let errorMessage = "Login failed. Please try again"
    $: showNotification = timeout !== undefined
    
    let invalid_password = false
    $: invalid_password = !/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{8,}$/.test(app_password);

    // @ts-ignore
    const hedge_login = async(e) => {
        e.preventDefault()
        
        // Prevent multiple submission // debounce
        if (isLoading) return;

        isLoading = true

        /* const form = e.target */
        /* const formData = Object.fromEntries(new FormData(form).entries) */
        /* const { email, password } = formData  */

        if (!app_email || !app_password) {
            errorMessage = "email and password are required"
            timeout = 5000
            setTimeout(() => { timeout = undefined; }, 5000)
            isLoading = false
            return
        }
        try {
            await user.login(app_email, app_password)
            app_password = ''
            goto('/dashboard')
        }
        catch(e) {
            errorMessage = e.message || "Invalid email or password"
            timeout = 5000
            setTimeout(() => { timeout = undefined }, 5000)
        } finally {
            isLoading = false
        }
    }

    const hedge_auth_status = async () => {
        try {
            const session = await account.getSession('current')
            if (session) goto('/dashboard')
            else goto('/') 
        }
        catch {
            goto('/')
        } 
    }

    let initialLoad = true
    onMount(async () => {
        try { await hedge_auth_status() } 
        finally { initialLoad = false }
    })

    function handle_context_menu(e) { e.preventDefault() } 
    
</script>

<div class="App-Title"><h2>Hedge <span style="font-size: 13px;">{' / '}{pageTitle}</span> </h2></div>
<div class="App-Theme"><Button kind="ghost" on:click={() => (open = true)}>Theme</Button></div>

<!-- hedge-theme-constraint -->
<Modal bind:open passiveModal modalHeading="App Theme">
    <Theme bind:theme persist persistKey="app_hedge-theme" />
    <RadioButtonGroup legendText="Choose from below" bind:selected={theme}>
        {#each ["white", "g100"] as value}
            <RadioButton labelText={value} {value} />
        {/each}
    </RadioButtonGroup>
</Modal>

<!-- hedge-login-form -->
<div class="App-Login--Flex" on:contextmenu={handle_context_menu} aria-label="disable right click context menu" role="button" tabindex="0">
    <div class="App-Login--Form">
        <!--[--><!--]-->
        <!--[--><!--]-->
        <FluidForm style="width: auto;" method="post" on:submit={hedge_login}>
            <div style="display: flex; justify-content: start;"> 
                <div>
                    <h1>Login to <strong>Hedge</strong></h1><br>
                    <div>Don't have an account? <Link inline href="/register">Sign up</Link></div>
                </div>
            </div>
            <div style="margin-top: 25px; display: flex; justify-content: center;">
                <div>
                    <TextInput labelText="Email Address" style="width: 350px;" name='email' bind:value={app_email} autocomplete="off" spellcheck="false" required />
                    <PasswordInput type="password" labelText="Password" name='password' bind:value={app_password} required />
                </div>
            </div>
            <!--[--><!--]-->
            <!--[--><!--]-->
            <div style="margin-top: 15px; width: auto; display: flex; justify-content: center;">
                <Button icon={ChevronRight} class="App-Login--Btn" style="margin-right: auto;" type="submit">
                    {#if isLoading}
                        <Loading withOverlay={false} small />
                    {:else}
                        {'Submit'}
                    {/if}
                </Button>
                <Button class="App-Forgot--Btn" style="margin-left: auto;" on:click={()=>goto('/forgot')}>Forgot Password</Button>
            </div>
        </FluidForm>
        <!--[--><!--]-->
        <!--[--><!--]-->
        <div style="margin-top: 15px; width: auto; display: flex; justify-content: start; width: auto;">
            <Link size="sm" href="/providers/serve/">More Login Options</Link>
        </div>
        <!--[--><!--]-->
        <!--[--><!--]-->
    </div>
</div>

<!-- hedge-copyright -->
<div style="position: fixed; bottom: 0; margin: 12px;">
    <p style="font-size: 12px; margin-left: 32px;"></p>
</div>

<!-- hedge-authconfig-error -->
{#if showNotification}
  <div transition:fade>
    <ToastNotification
      class="appErrNotification"
      timeout = {timeout}
      kind="error"
      title="Login failed"
      subtitle={errorMessage}
      caption={new Date().toLocaleString()}
      on:close={(e) => {
        timeout = undefined;
        // console.log(e.detail.timeout);
      }}
    />
  </div>
{/if}