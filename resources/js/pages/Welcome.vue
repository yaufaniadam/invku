<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { dashboard, login, register } from '@/routes';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { ref, onMounted } from 'vue';

withDefaults(
    defineProps<{
        canRegister: boolean;
    }>(),
    {
        canRegister: true,
    },
);

const loaded = ref(false);

onMounted(() => {
    setTimeout(() => {
        loaded.value = true;
    }, 100);
});
</script>

<template>
    <Head title="Welcome">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
    </Head>

    <div class="splash-screen">
        <!-- Animated background elements -->
        <div class="bg-orbs">
            <div class="orb orb-1"></div>
            <div class="orb orb-2"></div>
            <div class="orb orb-3"></div>
        </div>

        <!-- Floating grid pattern -->
        <div class="grid-pattern"></div>

        <!-- Main content -->
        <div :class="['splash-content', { 'is-loaded': loaded }]">
            <!-- Logo -->
            <div class="logo-container">
                <div class="logo-glow"></div>
                <div class="logo-box">
                    <AppLogoIcon class="logo-icon" />
                </div>
            </div>

            <!-- Brand name -->
            <h1 class="brand-name">Invku</h1>
            <p class="brand-tagline">Platform Penagihan SaaS Modern</p>

            <!-- Feature pills -->
            <div class="feature-pills">
                <div class="pill">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    <span>Invoice</span>
                </div>
                <div class="pill">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    <span>Pembayaran</span>
                </div>
                <div class="pill">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                    <span>Laporan</span>
                </div>
            </div>

            <!-- CTA Buttons -->
            <div class="cta-buttons">
                <template v-if="$page.props.auth.user">
                    <Link :href="dashboard()" class="btn btn-primary" id="dashboard-btn">
                        <span>Buka Dashboard</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </Link>
                </template>
                <template v-else>
                    <Link :href="login()" class="btn btn-primary" id="login-btn">
                        <span>Masuk</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </Link>
                    <Link v-if="canRegister" :href="register()" class="btn btn-secondary" id="register-btn">
                        Daftar Akun Baru
                    </Link>
                </template>
            </div>
        </div>

        <!-- Bottom decoration -->
        <div class="splash-footer">
            <p>&copy; {{ new Date().getFullYear() }} Invku. All rights reserved.</p>
        </div>
    </div>
</template>

<style scoped>
* {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.splash-screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #09090b;
    position: relative;
    overflow: hidden;
    padding: 2rem;
}

/* ===== ANIMATED BACKGROUND ===== */
.bg-orbs {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
}

.orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.4;
    animation: float 20s ease-in-out infinite;
}

.orb-1 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, hsl(262, 83%, 58%) 0%, transparent 70%);
    top: -10%;
    left: -10%;
    animation-delay: 0s;
}

.orb-2 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, hsl(220, 83%, 53%) 0%, transparent 70%);
    bottom: -10%;
    right: -10%;
    animation-delay: -7s;
}

.orb-3 {
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, hsl(280, 80%, 50%) 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: -14s;
}

@keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(30px, -40px) scale(1.05); }
    50% { transform: translate(-20px, 20px) scale(0.95); }
    75% { transform: translate(40px, 30px) scale(1.02); }
}

.grid-pattern {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
}

/* ===== MAIN CONTENT ===== */
.splash-content {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 480px;

    /* Initial state for animation */
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.splash-content.is-loaded {
    opacity: 1;
    transform: translateY(0);
}

/* ===== LOGO ===== */
.logo-container {
    position: relative;
    margin-bottom: 2rem;
}

.logo-glow {
    position: absolute;
    inset: -20px;
    border-radius: 50%;
    background: radial-gradient(circle, hsl(262, 83%, 58%, 0.3) 0%, transparent 70%);
    animation: pulse-glow 3s ease-in-out infinite;
}

@keyframes pulse-glow {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
}

.logo-box {
    position: relative;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 24px;
    background: linear-gradient(135deg, hsl(262, 83%, 58%) 0%, hsl(280, 80%, 50%) 100%);
    box-shadow:
        0 0 40px hsl(262, 83%, 58%, 0.3),
        0 20px 60px hsl(262, 83%, 58%, 0.15),
        inset 0 1px 0 rgba(255,255,255,0.2);
}

.logo-icon {
    width: 40px;
    height: 40px;
    color: white;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

/* ===== BRAND NAME ===== */
.brand-name {
    font-size: 3.5rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    background: linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 0.5rem;
    line-height: 1.1;
}

.brand-tagline {
    font-size: 1.1rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
    margin: 0 0 2.5rem;
    letter-spacing: 0.01em;
}

/* ===== FEATURE PILLS ===== */
.feature-pills {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 3rem;
    flex-wrap: wrap;
    justify-content: center;
}

.pill {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 100px;
    font-size: 0.85rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.pill:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.8);
    transform: translateY(-1px);
}

.pill svg {
    opacity: 0.7;
}

/* ===== CTA BUTTONS ===== */
.cta-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
    max-width: 280px;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.875rem 2rem;
    border-radius: 14px;
    font-size: 0.95rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;
    border: none;
    position: relative;
    overflow: hidden;
}

.btn-primary {
    background: linear-gradient(135deg, hsl(262, 83%, 58%) 0%, hsl(280, 80%, 50%) 100%);
    color: white;
    box-shadow:
        0 0 20px hsl(262, 83%, 58%, 0.25),
        0 8px 30px hsl(262, 83%, 58%, 0.2),
        inset 0 1px 0 rgba(255,255,255,0.15);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow:
        0 0 30px hsl(262, 83%, 58%, 0.35),
        0 12px 40px hsl(262, 83%, 58%, 0.3),
        inset 0 1px 0 rgba(255,255,255,0.15);
}

.btn-primary:active {
    transform: translateY(0);
}

.btn-primary svg {
    transition: transform 0.3s ease;
}

.btn-primary:hover svg {
    transform: translateX(3px);
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

.btn-secondary:active {
    transform: translateY(0);
}

/* ===== FOOTER ===== */
.splash-footer {
    position: absolute;
    bottom: 2rem;
    z-index: 10;
}

.splash-footer p {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.2);
    margin: 0;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 480px) {
    .brand-name {
        font-size: 2.75rem;
    }

    .brand-tagline {
        font-size: 1rem;
    }

    .feature-pills {
        gap: 0.5rem;
    }

    .pill {
        font-size: 0.8rem;
        padding: 0.4rem 0.85rem;
    }

    .logo-box {
        width: 64px;
        height: 64px;
        border-radius: 20px;
    }

    .logo-icon {
        width: 32px;
        height: 32px;
    }
}
</style>
