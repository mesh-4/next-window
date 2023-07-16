import * as React from 'react'

function Page() {
	const [count, setCount] = React.useState(0)

	const onClick = () => {
		setCount((prev) => prev + 1)
	}

	return (
		<div>
			<p>{count}</p>
			<button onClick={onClick}>+1</button>
		</div>
	)
}

export default Page
