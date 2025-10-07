<script>
    import './styles/root.css';
    import './styles/dashboard.css'
    
    // Carbon Components
    import 'carbon-icons-svelte';
    import 'carbon-components-svelte/css/g100.css';
    import { 
        Header,
        SideNav,
        SideNavItems,
        SideNavMenuItem,
        SideNavMenu,
        HeaderUtilities,
        Button,
    } from 'carbon-components-svelte';

    import { 
        User,
        Logout, 
        SettingsAdjust, 
        UserAvatarFilledAlt,  
        FitToWidth

    } from 'carbon-icons-svelte';

    // Auth management
    import { onMount } from 'svelte';
    import { account } from '$lib/appwrite';
    import { AppwriteException } from 'appwrite';
    import { goto, invalidateAll } from '$app/navigation';

    let app_email = '';
    let app_username = '';
    let initialLoad = true;
    let isAuthenticated = false;
    let globalUserName = '';

    const checkAuthStatus = async () => {
        try {
            const response = await account.get();
            
            if (!response) {
                throw new Error('No user data received');
            }

            app_username = response.name;
            app_email = response.email;
            isAuthenticated = true;
            globalUserName = app_username
                .replace(/_/g, ' ')
                .replace(/\b\w/g, char => char.toUpperCase())
                .split(' ')[0];

        } catch (err) {
            console.log('Auth error:', err);
            isAuthenticated = false;
            await account.deleteSession({
                sessionId: 'current'
            });
            goto('/login', { replaceState: true });
        } finally {
            initialLoad = false;
        }
    };

    onMount(() => {
        checkAuthStatus();
    });

    let isSideNavOpen = false;

    async function app_logout() {
        try {
            await account.deleteSession({
                sessionId: 'current'
            })
        } catch(err) {
            console.warn('Logout error: ', err)
        } finally {
            await invalidateAll()
            goto('/login')
        }
    }

    $: if (!initialLoad && !isAuthenticated) {
        goto('/login')
    }
</script>

<svelte:head>
    <title>The Hedge</title>
</svelte:head>

{#if initialLoad}
    <div class="ax-dash--context-a">
        <div class="overlay"><div class="spinner center"> {#each Array(12) as _, i} <div class="spinner-blade"></div> {/each}</div></div>
    </div>
{:else if isAuthenticated}
    <div class="AppDash-TopNav--A">
        <Header
            persistentHamburgerMenu={true}
            platformName={globalUserName}
            bind:isSideNavOpen
        >
            <HeaderUtilities>
                <!-- Add header utilities here -->
                 <Button iconDescription="Profile" icon={User} kind="ghost" />
            </HeaderUtilities>
        </Header>

        <SideNav bind:isOpen={isSideNavOpen}>
            <SideNavItems>
                <SideNavMenuItem href="/" text="Demo" />
                <SideNavMenu text="Demo">
                    
                    <SideNavMenuItem href="/?gen=#hedge-route-demo" text="Demo" />
                    <SideNavMenuItem href="/?gen=#hedge-route-demo" text="Demo" />
                    <SideNavMenuItem href="/?gen=#hedge-route-demo" text="Demo" />
                </SideNavMenu>

                <div class="footer-texts">
                    <Button kind="ghost" icon={Logout} on:click={app_logout} style='width: 135px;'>Logout</Button><br><br>
                    <p>© The Hedge 2025</p>
                    <p class="version">0-alpha.1.14-hedge</p>
                </div>
            </SideNavItems>
        </SideNav>
    </div>
{:else}
    <div class="ax-dash--context-a">
        <h2>Login to continue</h2>
    </div>
{/if}