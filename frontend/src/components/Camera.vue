<script setup lang="ts">
import { ref , Ref, onMounted, onBeforeUnmount, watch} from "vue";
import {ImageChangeMode } from '../models/leftovers';

const props = defineProps<{
	edit: boolean,
	image?: HTMLImageElement
}>();

const emit = defineEmits<{
	(e: 'imageChanged', d: {mode:ImageChangeMode, data?:Blob}): void
}>();

	
const pic_size = 800;
const capture_mode = ref(false);
const has_capture = ref(false);
const suppress_image = ref(false);

const camera_elem :Ref<HTMLVideoElement	|null> = ref(null);
const canvas_elem :Ref<HTMLCanvasElement|null> = ref(null);

onMounted(async () => {
	updateCanvas();
	if( !props.edit ) enterCaptureMode();
});
onBeforeUnmount(() => {
	stopCameraStream();
});

watch( () => props.image, () => {
	if( !props.image ) return;// or maybe clear the canvas? (because maight have image from prior capture)
	capture_mode.value = false;
	props.image.onload = () => {
		updateCanvas();	
	}
});
function toggleSuppressImage() {
	suppress_image.value = !suppress_image.value;
	updateCanvas();
	emitEvent();
}

function doCapture() {
	if( camera_elem.value == null ) return;
	
	capture_mode.value = false;
	has_capture.value = true;
	
	updateCanvas();
	emitEvent();
}
function clearCapture() {
	has_capture.value = false;
	updateCanvas();
	emitEvent();
}
function enterCaptureMode() {
	capture_mode.value = true;
}
function exitCaptureMode() {
	capture_mode.value = false;
	updateCanvas();
}

watch(capture_mode, () => {
	if( capture_mode.value ) createCameraElement()
	else stopCameraStream();
}, {immediate: true});

const no_cam_insecure = ref(!navigator.mediaDevices);
const camera_error = ref('');
async function createCameraElement() {
	if( !navigator.mediaDevices ) return;
	camera_error.value = '';
	let stream :MediaStream|undefined;
	try {
		stream = await navigator.mediaDevices.getUserMedia({
			audio: false,
			video: {
				facingMode: {
					ideal: 'environment'
				}
			}
		});
	} catch(err) {
		// Sometimes this can happen if the user leaves the page quickly after landing on it.
		camera_error.value = err+'';
	}
	if( camera_elem.value && stream ) camera_elem.value.srcObject = stream;
}

function stopCameraStream() {
	if( camera_elem.value == null || camera_elem.value.srcObject == null ) return;
	(<MediaStream>camera_elem.value.srcObject).getTracks().forEach(track => {
		track.stop();
	});
}

function updateCanvas() {
	if( canvas_elem.value == null || camera_elem.value == null ) return;
	const ctx = canvas_elem.value.getContext('2d');
	if( ctx == null ) return;

	canvas_elem.value.width = pic_size;
	canvas_elem.value.height = pic_size;

	if( has_capture.value ) {
		const vid_w = camera_elem.value.videoWidth;
		const vid_h = camera_elem.value.videoHeight;
		const vid_min = Math.min(vid_w, vid_h);
		ctx.drawImage(camera_elem.value, (vid_w-vid_min)/2, (vid_h-vid_min)/2, vid_min, vid_min, 0, 0, pic_size, pic_size);
	}
	else if( props.image && props.image.complete && !suppress_image.value ) {
		ctx.drawImage(props.image, 0, 0, pic_size, pic_size);
	}
	else {
		ctx.fillStyle = '#ddd';
		ctx.fillRect(0, 0, pic_size, pic_size);
	}
}

function emitEvent() {
	if( has_capture.value ) {
		canvas_elem.value?.toBlob( (b:Blob|null) => {
			if( b ) emit('imageChanged', {mode:ImageChangeMode.Replace, data:b});
		}, "image/jpeg", 0.75)
	}
	else if( props.image && !suppress_image.value ) {
		emit('imageChanged', {mode:ImageChangeMode.Keep});
	}
	else {
		emit('imageChanged', {mode:ImageChangeMode.NoImage});
	}
}

</script>

<template>
	<div class="flex justify-center">
		<div class="relative">  
			<video v-show="capture_mode" ref="camera_elem" autoplay class="w-80 h-80 object-center object-cover"></video>
			<canvas v-show="!capture_mode" ref="canvas_elem" class="w-80 h-80"></canvas>
		
			<div class="flex justify-center -mt-7" v-if="capture_mode">
				<button @click="exitCaptureMode" class="bg-white text-blue-700 border border-blue-700 p-4 rounded-full mr-6 z-10">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
				<button @click="doCapture" class="bg-blue-600 text-white p-4 rounded-full z-10">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
				</button>
			</div>
			<div class="flex justify-center -mt-7" v-else>
				<button v-if="has_capture" @click="clearCapture" class="bg-blue-600 text-white p-4 rounded-full mr-4 z-10">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
					</svg>
				</button>
				<button v-else-if="image && suppress_image" @click="toggleSuppressImage" class="h-14 w-14 rounded-full overflow-hidden mr-4 z-10">
					<img :src="image.src" class="object-cover">
				</button>
				<button v-else-if="image && !suppress_image" @click="toggleSuppressImage" class="bg-blue-600 text-white p-4 rounded-full mr-4 z-10">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
					</svg>
				</button>
				<button @click="enterCaptureMode" class="bg-white text-blue-700 border border-blue-700 p-4 rounded-full z-10">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
				</button>
			</div>
			<div class="absolute top-0 text-balance text-center p-2 bg-yellow-100" v-if="no_cam_insecure">
				<p class="my-2">Leftovers is running in an insecure context, which prevents the camera from working.</p>
				<p class="my-2">Please enable HTTPS on your instance to use the camera.</p>
			</div>
			<div class="absolute top-0 text-balance text-center p-2 bg-yellow-100" v-if="camera_error !== ''">
				<p class="my-2">Unable to use the camera :(</p>
				<p class="my-2">
					Cryptic Error Message:
					<span class="italic">{{ camera_error }}</span></p>
			</div>
		</div>
	</div>
</template>
