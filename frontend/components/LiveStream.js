export default function LiveStream() {
    return (
        <div className="p-4">
            <h2 className="text-xl mb-2">Live Room Stream</h2>
            <img 
                src="http://localhost:5000/video_feed"
                alt="Live Stream"
                className="border border-gray-400 w-full max-w-3xl"
            />
        </div>
    )
}