
import React, { useState } from 'react';
import { PlayCircleIcon } from './icons/PlayCircleIcon';
import VideoModal from './modals/VideoModal';

const videoHighlights = [
  {
    id: 1,
    thumbnailUrl: 'https://picsum.photos/seed/video1/1280/720',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    title: 'A Day at Innovate Inc.',
    description: 'Get a glimpse into the culture and innovation at Innovate Inc.'
  },
  {
    id: 2,
    thumbnailUrl: 'https://picsum.photos/seed/video2/1280/720',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    title: 'Sarah J\'s Success Story',
    description: 'Hear from a real user about how JobHub changed their career.'
  },
  {
    id: 3,
    thumbnailUrl: 'https://picsum.photos/seed/video3/1280/720',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    title: 'Inside Creative Solutions',
    description: 'Explore the vibrant and collaborative workspace at Creative Solutions.'
  },
  {
    id: 4,
    thumbnailUrl: 'https://picsum.photos/seed/video4/1280/720',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    title: 'Remote Work at Tech Giant',
    description: 'Learn how Tech Giant fosters a productive and connected remote team.'
  },
];


const VideoHighlights: React.FC = () => {
    const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

  return (
    <>
      <section className="bg-neutral-light py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark">Company Spotlights</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              See what it's like to work at some of the best companies and hear success stories from our community.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {videoHighlights.map((video) => (
                <div key={video.id} className="group cursor-pointer" onClick={() => setSelectedVideoUrl(video.videoUrl)}>
                    <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                        <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <PlayCircleIcon className="w-20 h-20 text-white/80" />
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <h3 className="font-bold text-lg text-neutral-dark">{video.title}</h3>
                        <p className="text-sm text-gray-500">{video.description}</p>
                    </div>
                </div>
            ))}
          </div>
        </div>
      </section>
      {selectedVideoUrl && (
        <VideoModal videoUrl={selectedVideoUrl} onClose={() => setSelectedVideoUrl(null)} />
      )}
    </>
  );
};

export default VideoHighlights;
