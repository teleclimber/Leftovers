<template>
	<div>
		<div class="camera-box">  
			<video v-show="capture_mode" ref="camera_elem" :width="width" :height="height" autoplay></video>
			<canvas v-show="!capture_mode" ref="canvas_elem" :width="width" :height="height"></canvas>
		</div>

		<div class="flex justify-center">
			<button v-if="capture_mode" @click="captureImage" class="bg-blue-300 p-2 rounded">
				Take Picture
			</button>
			<button v-if="!capture_mode" @click="enterCaptureMode" class="bg-blue-300 p-2 rounded">
				Take another Picture
			</button>
		</div>

	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref , Ref, onMounted, onBeforeUnmount} from "vue";

export default defineComponent({
	name: "Camera",
	components: {
		
	},
	emits:['imageCaptured'],
	setup(_, context) {
		const width = ref(400);
		const height = ref(400);
		const capture_mode = ref(true);

		const camera_elem :Ref<HTMLVideoElement	|null> = ref(null);
		const canvas_elem :Ref<HTMLCanvasElement|null> = ref(null);

		onMounted(async () => {
			await createCameraElement();
		});
		onBeforeUnmount(() => {
			stopCameraStream();
		});

		function captureImage() {
			if( canvas_elem.value == null || camera_elem.value == null ) return;
			const ctx = canvas_elem.value.getContext('2d');
			if( ctx == null ) return;
			ctx.drawImage(camera_elem.value, 0, 0, 450, 337.5);

			capture_mode.value = false;

			canvas_elem.value.toBlob( (b:Blob|null) => {
				console.log("camera data bloc", b);
				if( b ) context.emit('imageCaptured', b);
			}, "image/jpeg", 0.7)
		}
		function enterCaptureMode() {
			capture_mode.value = true;
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


		return {
			width, height,
			capture_mode,
			camera_elem, canvas_elem,
			captureImage, enterCaptureMode,
		}
	}
});
</script>