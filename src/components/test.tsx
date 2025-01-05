import { useEffect, useState } from 'react'

interface Blog {
  id: number
  title: string
  content: string
}

function Test() {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/blogs`)
        .then((res) => {
            if (!res.ok) throw new Error('Network error')
            return res.json()
        })
        .then((data: Blog[]) => {
            setBlogs(data)
            setLoading(false)
        })
        .catch((err) => {
            setError(err.message)
            setLoading(false)
        })
    }, [])

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

        
    return (
        <ul>
            {blogs.map((b) => (
            <li key={b.id}>
                <h2>{b.title}</h2>
                <p>{b.content}</p>
            </li>
            ))}
        </ul>
    )
}

export default Test