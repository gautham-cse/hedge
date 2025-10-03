<svelte:head>
    <title> {'Recovery'} </title>
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

    // svelte-authentication
    import { user } from '$lib/user'
    import { error } from '@sveltejs/kit'
    import { goto } from '$app/navigation'
    import { fade } from 'svelte/transition'
    import { preventDefault } from 'svelte/legacy'
    import { account } from '$lib/appwrite';
    import { onMount } from 'svelte';
    

    // hedge-constraints
    let open = false
    let app_password = ''
    let app_password_confirm = ''
    let pageTitle = 'Recovery'
    let theme = "white"
    let isLoading = false
    
    let timeout = undefined 
    let showMessage = null

    let errorMessage = "Password reset failed"
    let successMessage = "Password reset successful"
    let invalidUrlMessage = "Invalid Recovery URL"

    $: showSuccNotification = timeout === 'success'
    $: showErrrNotification = timeout === 'error'
    $: showParamsNotification = timeout === 'invalid'

    function isStrongPassword(password) {
        const minLength = 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return password.length >= minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
    }

    const startPasswordRecovery = async (e) => {
        e.preventDefault() 
        isLoading = true 
        
        if (!app_password || !app_password_confirm) {
            errorMessage = "Please fill out all the fields"
            isLoading = false 
            return
        }
        
        if (app_password !== app_password_confirm) {
            errorMessage = "Passwords don\'t match"
            isLoading = false 
            return 
        }

        if (app_password.length < 8 || app_password_confirm.length < 8) {
            errorMessage = "Password must be greater than 8 characters"
            isLoading = false 
            return 
        }

        if (!isStrongPassword(app_password) || !isStrongPassword(app_password_confirm)) {
            errorMessage = "Password is too weak. Ensure it has at least 8 characters, including uppercase, lowercase, a number, and a special character."
            isLoading = false 
            return 
        }

        const urlParams = new URLSearchParams(window.location.search)
        const secret = urlParams.get('secret')
        const userId = urlParams.get('userId')

        if (!userId || !secret) {
            invalidUrlMessage = "The recovery link is invalid. Please follow the instructions to reset your password correctly"
            timeout = 'invalid'
            return 
        }

        try {
            const updatedUser = await account.updateRecovery(userId, secret, app_password, app_password_confirm)
            showMessage = "Password reset successful. Login now"
            timeout = 'success'
            isLoading = false 
            setTimeout(() => {
                timeout = undefined 
            }, 3000)
            setTimeout(() => {
                goto('/')
            }, 3500)
        } catch(e) {
            showMessage = "Password reset unsuccessful. Please try again" + e.message
            timeout = 'error'
            isLoading = false 

            setTimeout(() => {
                timeout = undefined 
            }, 3000)

            throw error(500, "Recovery failed")
        } 
        
        finally { isLoading = false }
    }

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search)
        if (!urlParams.get('userId') || !urlParams.get('secret')) {
            timeout = 'invalid'
            isLoading = false
            // update the code 
            // check recovery timestamp from the appwrite realtime database
        }
    })

    function handle_context_menu(e) { e.preventDefault() } 
</script>

<div class="App-Title"><h2>hedge <span style="font-size: 13px;">{' / '}{pageTitle}</span> </h2></div>
<div class="App-Theme"><Button kind="ghost" on:click={() => (open = true)}>Theme</Button></div>

<!-- hedge-theme-constraint -->
<Modal bind:open passiveModal modalHeading="Constraint: Theme">
    <Theme bind:theme persist persistKey="app_hedge-theme" />
    <RadioButtonGroup legendText="Select theme" bind:selected={theme}>
        {#each ["white", "g10", "g80", "g90", "g100"] as value}
            <RadioButton labelText={value} {value} />
        {/each}
    </RadioButtonGroup>
</Modal>

<!-- hedge-login-form -->
<div class="App-Login--Flex" on:contextmenu={handle_context_menu} aria-label="disable right click context menu" role="button" tabindex="0">
    <div class="App-Login--Form">
        <!--[--><!--]-->
        <!--[--><!--]-->
        <FluidForm style="width: auto;" method="post" on:submit={startPasswordRecovery}>
            <div style="display: flex; justify-content: start;"> 
                <div>
                    <h1> {'Reset Password'} </h1>
                    <!-- <div>Create an account? <Link inline href="/register">Sign up</Link></div> -->
                </div>
            </div>
            <div style="margin-top: 25px; display: flex; justify-content: center;">
                <div>
                    <PasswordInput type="password" labelText="New Password" name='password' bind:value={app_password} style="width: 350px;" required />
                    <PasswordInput type="password" labelText="Confirm New Password" name='confirmpassword' bind:value={app_password_confirm} required />
                </div>
            </div>
            <!--[--><!--]-->
            <!--[--><!--]-->
            <div style="margin-top: 15px; width: auto; display: flex; justify-content: center;">
                <Button icon={ChevronRight} class="App-Login--Btn" style="margin-right: auto;" type="submit" disabled={isLoading}>
                    {#if isLoading}
                        <Loading withOverlay={false} small />
                    {:else}
                        {'Change Password'}
                    {/if}
                </Button>
                <!-- <Button class="App-Forgot--Btn" style="margin-left: auto;" on:click={()=>goto('/forgot')}>Forgot Password</Button> -->
            </div>
        </FluidForm>
        <!--[--><!--]-->
        <!--[--><!--]-->
        <div style="margin-top: 15px; width: auto; display: flex; justify-content: start; width: auto;">
            <Link size="sm" href="/">Go to Login</Link>
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
{#if showSuccNotification}
  <div transition:fade>
    <ToastNotification
      class="appErrNotification"
      timeout = {5000}
      kind="success"
      title={successMessage}
      subtitle={showMessage}
      caption={new Date().toLocaleString()}
      on:close={(e) => {
        timeout = undefined;
        // console.log(e.detail.timeout);
      }}
    />
  </div>
{/if}

{#if showErrrNotification}
  <div transition:fade>
    <ToastNotification
      class="appErrNotification"
      timeout = {3000}
      kind="error"
      title={errorMessage}
      subtitle={showMessage}
      caption={new Date().toLocaleString()}
      on:close={(e) => {
        timeout = undefined;
        // console.log(e.detail.timeout);
      }}
    />
  </div>
{/if}

{#if showParamsNotification}
  <div transition:fade>
    <ToastNotification
      class="appErrNotification"
      timeout = {5000}
      kind="error"
      title="Unable to validate recovery parameters"
      subtitle={invalidUrlMessage}
      caption={new Date().toLocaleString()}
      on:close={(e) => {
        timeout = undefined;
        // console.log(e.detail.timeout);
      }}
    />
  </div>
{/if}