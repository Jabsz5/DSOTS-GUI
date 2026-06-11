<script setup>

</script>

<template>
	<nav class="nav" aria-label="Main navigation">
        <h1>DSOTS Thumbnail Creator</h1>
	</nav>
</template>

<style lang="scss" scoped>
h1 {
	margin: 0;
	font-size: 4.25rem;
    text-align: center;
}

nav {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: 0.85rem max(1rem, calc((100vw - var(--page-max)) / 2));
	background: var(--secondary-color);
	color: #171522;
}

.brand {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	min-width: 0;
}

.brand-mark {
	width: 2.25rem;
	height: 2.25rem;
	flex: 0 0 auto;
	border-radius: 999px;
	// background: var(--primary-color);
	background: #ff00d4;
	background: radial-gradient(circle, rgba(255, 0, 212, 1) 0%, rgba(0, 11, 92, 1) 50%, rgba(0, 0, 0, 1) 100%);
}

p {
	margin: 0.1rem 0 0;
	font-size: 0.82rem;
	font-weight: 600;
	opacity: 0.78;
}

.nav-links {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 0.45rem;
	flex-wrap: wrap;
	font-weight: 700;
	min-width: 0;
}

.nav-links a {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-height: 42px;
	padding: 0.55rem 0.7rem;
	border-radius: 999px;
	text-decoration: none;
}

.nav-links a {
	background: rgba(255, 255, 255, 0.60);
}

.active {
	// background: rgba(255, 255, 255, 0.38) !important;
	background: var(--primary-color) !important;
}

@media (max-width: 760px) {
	nav {
		align-items: flex-start;
		flex-direction: column;
		padding: 0.85rem 0.75rem;
	}

	.nav-links {
		width: 100%;
		justify-content: flex-start;
	}

	.nav-links a {
		flex: 1 1 135px;
	}
}
</style>
