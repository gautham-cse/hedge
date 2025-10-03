<svelte:head>
    <title> {pageTitle} </title>
</svelte:head>

<script>
    // @ts-nocheck
    const pageTitle = 'Forgot'
    
    let theme = "white"
    let open = false 

    import '../styles/root.css'
    import 'carbon-components-svelte/css/all.css'
    import { fade } from 'svelte/transition'
    import { 
        Link,
        OutboundLink,
        Theme,
        Modal,
        Button,
        FluidForm,
        TextInput,
        PasswordInput,
        RadioButton,
        RadioButtonGroup,
        ToastNotification,
    } from 'carbon-components-svelte'

    import { ChevronRight, Beta } from 'carbon-icons-svelte'
    import { goto } from '$app/navigation'
    import { account } from '$lib/appwrite';

    let recovery_mail = ''
    let isLoading = false
    let timeout = undefined
    
    let showMessage = null
    let errorMessage = "Password reset failed"
    let successMessage = "Password reset email sent. Redirecting to Login"

    $: showSuccNotification = timeout === 'success'
    $: showErrrNotification = timeout === 'error'

    const sendPasswordResetUrl = async (e) => {
        isLoading = true
        e.preventDefault()

        if (!recovery_mail){
            isLoading = false
            return 
        }

        try {
            await account.createRecovery(recovery_mail, 'https://thehedge.pages.dev/recovery')
            .then((response) => {
                showMessage = "Password reset email sent successfully. Please check your inbox or spam folder"
                timeout = 'success'

                setTimeout(() => {
                    timeout = undefined 
                }, 3000)
                
                setTimeout(() => {
                    goto('/')
                }, 5100)

            }, (error) => {
                showMessage = error.message || "Failed to send reset email"
                timeout = 'error'

                setTimeout(() => {
                    timeout = undefined 
                }, 3000)
            })

        }
        catch(e) {}
        finally {
            isLoading = false 
        }
    }

</script>

<div class="App-Title"><h2>The Hedge <span style="font-size: 13px;">{' / '}{pageTitle}</span> </h2></div>
<div class="App-Theme"><Button kind="ghost" on:click={() => (open = true)}>Theme</Button></div>

<Modal bind:open passiveModal modalHeading="Constraint - Theme">
    <Theme bind:theme persist persistKey="app_hedge-theme" />
    <RadioButtonGroup legendText="Select theme" bind:selected={theme}>
        {#each ["white", "g10", "g80", "g90", "g100"] as value}
            <RadioButton labelText={value} {value} />
        {/each}
    </RadioButtonGroup>
</Modal>

<div class="App-Login--Flex">
    <div class="App-Login--Form">
        
        <FluidForm style="width: auto;" on:submit={sendPasswordResetUrl}>
            <div style="display: flex; justify-content: start;"> 
                <div>
                    <h1> {'Reset Password'} </h1>
                    <!-- <div>Create an account? <Link inline href="/register">Sign up</Link></div> -->
                </div>
            </div>
            <div style="margin-top: 25px; display: flex; justify-content: center;">
                <div>
                    <TextInput labelText="Email Address" style="width: 350px;" bind:value={recovery_mail} required />
                    <!-- <PasswordInput type="password" labelText="Password" required /> -->
                </div>
            </div>

            <div style="margin-top: 15px; width: auto; display: flex; justify-content: center;">
                <Button icon={ChevronRight} class="App-Login--Btn" style="margin-right: auto;" type="submit" disabled={isLoading}>Submit</Button>
                <!-- <Button class="App-Forgot--Btn" style="margin-left: auto;" on:click={()=>goto('/forgot')}>Forgot Password</Button> -->
            </div>

        </FluidForm>

        <div style="margin-top: 15px; width: auto; display: flex; justify-content: start; width: auto;">
            <Link size="sm" href="/">Back</Link>
        </div>

    </div>
</div>

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