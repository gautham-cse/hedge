<script lang="ts">
	let time = $state(0);
	let duration = $state();
	let paused = $state(true);
	let showControls = $state(true);

	// @ts-ignore
	let showControlsTimeout;
	// @ts-ignore
	let lastMouseDown;

	// @ts-ignore
	function handleMove(e) {
		// @ts-ignore
		clearTimeout(showControlsTimeout);
		showControlsTimeout = setTimeout(() => (showControls = false), 2500);
		showControls = true;

		if (!duration) return;
		if (e.type !== 'touchmove' && !(e.buttons & 1)) return;

		const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
		// @ts-ignore
		const { left, right } = this.getBoundingClientRect();
		time = (duration * (clientX - left)) / (right - left);
	}

	// @ts-ignore
	function handleMousedown(e) {
		lastMouseDown = new Date();
	}

	// @ts-ignore
	function handleMouseup(e) {
		// @ts-ignore
		if (new Date() - lastMouseDown < 300) {
			if (paused) e.target.play();
			else e.target.pause();
		}
	}

	// @ts-ignore
	function format(seconds) {
		if (isNaN(seconds)) return '...';
		const minutes = Math.floor(seconds / 60);
		seconds = Math.floor(seconds % 60);
		if (seconds < 10) seconds = '0' + seconds;
		return `${minutes}:${seconds}`;
	}
</script>

<main>
    <h1>VirusTotal Integration Demo</h1> <pre>(( A classified product ))</pre><br><br>
    <p>This video demonstrates a partial integration of a self-healing AI system with the VirusTotal API, which scans for malware by submitting data to VirusTotal and retrieving threat information and ratings</p>
    <br>
<div class="video-wrapper">
	<video
		src="https://r3d-blackice-sentinel-engine.s3.jp-osa.cloud-object-storage.appdomain.cloud/BlackIce-Sentinel-Engine.mp4"
		poster=""
		bind:currentTime={time}
		bind:duration
		bind:paused
		onmousemove={handleMove}
		ontouchmove={e => { e.preventDefault(); handleMove(); }}
		onmousedown={handleMousedown}
		onmouseup={handleMouseup}
	>
		<track kind="captions" />
	</video>

	<div class="controls" style="opacity: {duration && showControls ? 1 : 0}">
		<progress value={time / duration || 0}></progress>
		<div class="info">
			<span class="time">{format(time)}</span>
			<span>click to {paused ? 'play' : 'pause'} / drag to seek</span>
			<span class="time">{format(duration)}</span>
		</div>
	</div>
</div>
</main>

<style>

    main {
        padding: 10px;
    }
    
	h1 {
		color: #333;
		margin-bottom: 1rem;
	}

	.video-wrapper {
		position: relative;
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
		border-radius: 4px;
		overflow: hidden;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	video {
		width: 100%;
		display: block;
		background: black;
	}

	.controls {
		position: absolute;
		bottom: 0;
		width: 100%;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
		padding: 0.5em 1em;
		box-sizing: border-box;
		transition: opacity 0.6s ease;
	}

	progress {
		width: 100%;
		height: 8px;
		border-radius: 5px;
		overflow: hidden;
		-webkit-appearance: none;
		appearance: none;
		margin-bottom: 0.5em;
	}

	progress::-webkit-progress-bar {
		background-color: rgba(255, 255, 255, 0.2);
	}

	progress::-webkit-progress-value {
		background-color: #4fc3f7;
	}

	progress::-moz-progress-bar {
		background-color: #4fc3f7;
	}

	.info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: sans-serif;
		color: white;
		font-size: 1rem;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
	}

	.time {
		min-width: 3em;
		text-align: center;
		opacity: 0.8;
	}
</style>
