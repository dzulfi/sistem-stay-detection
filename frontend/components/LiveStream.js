export default function LiveStream({ camera }) {
    return (
        <div className="p-2 w-full md:w-1/2 lg:w-1/3">
            <h3 className="text-lg font-semibold mb-1">{camera.name_camera}</h3>
            <img
                src={`http://localhost:5000/video_feed/${camera._id}`} 
                alt={`Stream - ${camera.name_camera}`}
                className="border border-gray-400 w-full h-auto rounded-lg"
            />
        </div>
    );
}

// export default function LiveStream() {
//     return (
//         <div className="p-4">
//             <h2 className="text-xl mb-2">Live Room Stream</h2>
//             <img 
//                 src="http://localhost:5000/video_feed"
//                 alt="Live Stream"
//                 className="border border-gray-400 w-full max-w-3xl"
//             />
//         </div>
//     )
// }