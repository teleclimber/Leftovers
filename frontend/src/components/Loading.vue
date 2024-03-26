<style scoped>
.animated-loader {
	display: flex;
	gap:5px;
}
.animated-loader div {
	flex-grow: 2;
	height: 100%;
	background: rgba(255, 255, 255, 0.3);
	animation: animated-loader 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}
.animated-loader.gray div {
	background: rgba(38, 38, 38, 0.3);
}
.animated-loader div:nth-child(1) {
	animation-delay: -0.24s;
}
.animated-loader div:nth-child(2) {
	animation-delay: -0.12s;
}
.animated-loader div:nth-child(3) {
	animation-delay: 0;
}
@keyframes animated-loader {
	0% {
		transform: translateY(0%);
	}
	20% {
		transform: translateY(-70%);
	}
	70% {
		transform: translateY(0%);
	}
}
</style>
<template>
	<div class="flex items-center h-full justify-stretch animated-loader">
		<div></div><div></div><div></div>
	</div>
</template>