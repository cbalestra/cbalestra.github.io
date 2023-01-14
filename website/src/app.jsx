import { useEffect, useState, useRef, useCallback } from 'preact/hooks'
import './app.css'

export function App() {
	
	const canvasRef = useRef(null)
	const requestRef = useRef(null)
	const previousTimeRef = useRef(undefined)
	const beginTimeRef = useRef(undefined)

	const audioContextRef = useRef(null)

	
	const [ stars, setStars ] = useState([])

	
	useEffect(() => {
		let starsCount = 500, stars = []
		for(let i = 0; i < starsCount; i++)
		{
			stars.push({ x: Math.random() - 0.5, y: Math.random() - 0.5, z: Math.random() * 100, c: "rgba(128,128,160," + (0.5 + Math.random() * 0.5) + ")"});
		}
		setStars(stars)
		onResize()
	}, [])

	useEffect(() => {
		let audioCtx = new AudioContext
		audioContextRef.current = audioCtx

		window.addEventListener('resize', onResize)

		requestRef.current = requestAnimationFrame(animate)
		return () => { 
			cancelAnimationFrame(requestRef.current) 
			window.removeEventListener('resize', onResize)
			if(audioContextRef.current)
			{
				audioContextRef.current.close()
				audioContextRef.current = null
			}
		}
	}, [stars])

	const onResize = () => {
		console.log("resize")		
		let width = 1024 //window.innerWidth / 4
		let height = width * window.innerHeight / window.innerWidth

		let canvas = canvasRef.current
		canvas.width  = width
		canvas.height = height

	}

	const animate = (timestamp) => {
		if(previousTimeRef.current === undefined) previousTimeRef.current = timestamp
		if(beginTimeRef.current === undefined) beginTimeRef.current = timestamp
		const frameTime = timestamp - previousTimeRef.current
		const totalTime = timestamp - beginTimeRef.current

		let canvas = canvasRef.current
		let ctx = canvas.getContext("2d")
		let { width, height } = canvas
		
		ctx.save()
			ctx.globalAlpha = 1 / 4
			ctx.fillStyle = "#222"
			ctx.globalCompositeOperation = 'source-over'
			//ctx.scale(1.1, 1.1)
			//ctx.rotate(0.0001 * totalTime)
			ctx.fillRect(0, 0, width, height)
		ctx.restore()
		ctx.globalCompositeOperation = 'lighter'
		/*ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.rect(0, 0, canvas.width, canvas.height)
		ctx.fillStyle = 'red'
		ctx.fill()*/

		let aspectRatio = width / height;

		let t = new Date().getTime() / 1000;

		for(let s of stars)
		{
			let z = 10 - (Math.abs((s.z + t*0.5)) % 10);
			//z = 10.5;
			if(z <= 0) continue;
			z *= 0.5;
			let x = 0.5 * width * s.x / z;
			let y = 0.5 * aspectRatio * height * s.y / z;
			ctx.fillStyle = s.c;
			ctx.beginPath();
			ctx.arc((width * 0.5) + x, (height * 0.5) + y, 1 / z, 0, Math.PI*2, true);
			ctx.closePath();
			ctx.fill();
			//ctx.fillRect((width * 0.5) + x, (height * 0.5) + y, 1, 1);
		}
		
		requestRef.current = requestAnimationFrame(animate)
		previousTimeRef.current = timestamp
	}

	return (<div style='position: relative; display: flex; align-items: center; justify-content: center; inset: 0; width: 100vw; height: 100vh;'>
		<canvas ref={canvasRef} style='position: absolute; inset: 0; width: 100%; height: 100%; z-index: -1;'/>
		<h2>Christophe Balestra</h2>
	</div>)
}
