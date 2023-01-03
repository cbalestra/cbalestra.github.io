import { useEffect, useState, useRef, useCallback } from 'preact/hooks'
import './app.css'

export function App() {
	
	const canvasRef = useRef(null)
	const requestRef = useRef(null)
	const previousTimeRef = useRef(undefined)
	
	const [ stars, setStars ] = useState([])

	
	useEffect(() => {
		let starsCount = 500, stars = []
		for(let i = 0; i < starsCount; i++)
		{
			stars.push({ x: Math.random() - 0.5, y: Math.random() - 0.5, z: Math.random() * 100, c: "rgba(128,128,160," + (0.5 + Math.random() * 0.5) + ")"});
		}
		setStars(stars)
	}, [])

	useEffect(() => {
		requestRef.current = requestAnimationFrame(animate)
		return () => { cancelAnimationFrame(requestRef.current) }
	}, [stars])

	const animate = (timestamp) => {
		if(previousTimeRef.current === undefined) previousTimeRef.current = timestamp
		const frameTime = timestamp - previousTimeRef.current

		let width = window.innerWidth
		let height = window.innerHeight

		let canvas = canvasRef.current
		let ctx = canvas.getContext("2d")
		canvas.width  = width
		canvas.height = height

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
		<h2>Christophe Balestra</h2>
		<canvas ref={canvasRef} style='position: absolute; inset: 0;'/>
	</div>)
}
