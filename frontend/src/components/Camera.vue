<template>
	<div>
		<div class="camera-box">  
			<video v-show="capture_mode" ref="camera_elem" :width="width" :height="height" autoplay></video>
			<canvas v-show="!capture_mode" ref="canvas_elem" :width="width" :height="height"></canvas>
		</div>

		<div class="flex justify-center" v-if="capture_mode">
			<button @click="exitCaptureMode">&times; Close Camera</button>
			<button @click="doCapture" class="bg-blue-300 p-2 rounded">
				Take Picture
			</button>
		</div>
		<div class="flex justify-center" v-else>
			<button v-if="has_capture" @click="clearCapture" class="bg-blue-300 p-2 rounded">
				Clear Capture
			</button>
			<button v-else-if="image" @click="toggleSuppressImage" class="bg-blue-300 p-2 rounded">
				{{ suppress_image ? "Keep Picture" : "No Picture"}}
			</button>
			<button @click="enterCaptureMode" class="bg-blue-300 p-2 rounded">
				{{ image || has_capture ? "Replace Picture" : "Add Picture" }}
			</button>
		</div>

	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref , Ref, onMounted, onBeforeUnmount, watch} from "vue";
import {ImageChangeMode } from '../models/leftovers';

export default defineComponent({
	name: "Camera",
	components: {
		
	},
	emits:['imageChanged'],
	props: {
		image: {
			type: Image,
			required: false
		}
	},
	setup(props, context) {
		const width = ref(400);
		const height = ref(400);
		const capture_mode = ref(true);
		const has_capture = ref(false);
		const suppress_image = ref(false);

		const camera_elem :Ref<HTMLVideoElement	|null> = ref(null);
		const canvas_elem :Ref<HTMLCanvasElement|null> = ref(null);

		onMounted(async () => {
			await createCameraElement();
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

		async function createCameraElement() {
			const constraints = {
				audio: false,
				video: {
					facingMode: {
						ideal: 'environment'
					}
				}
			};

			try {
				const stream = await navigator.mediaDevices.getUserMedia(constraints);
				if( camera_elem.value == null ) throw new Error("camera elem is null");
				camera_elem.value.srcObject = stream;
			} catch(err) {
				alert("Maybe the browser didn't support this op or there are errors.");
				console.error(err);
			}
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

			if( has_capture.value ) {
				ctx.drawImage(camera_elem.value, 0, 0, 450, 337.5);
			}
			else if( props.image && props.image.complete && !suppress_image.value ) {
				ctx.drawImage(props.image, 0, 0);
			}
			else {
				ctx.fillStyle = '#ddd';
				ctx.fillRect(0, 0, width.value, height.value);
			}
		}

		function emitEvent() {
			if( has_capture.value ) {
				canvas_elem.value.toBlob( (b:Blob|null) => {
					console.log("camera data bloc", b);
					if( b ) context.emit('imageChanged', {mode:ImageChangeMode.Replace, data:b});
				}, "image/jpeg", 0.7)
			}
			else if( props.image && !suppress_image.value ) {
				context.emit('imageChanged', {mode:ImageChangeMode.Keep});
			}
			else {
				context.emit('imageChanged', {mode:ImageChangeMode.NoImage});
			}
		}

		return {
			width, height,
			suppress_image, toggleSuppressImage,
			capture_mode, has_capture,
			camera_elem, canvas_elem,
			doCapture, clearCapture, enterCaptureMode, exitCaptureMode,
		}
	}
});
</script>