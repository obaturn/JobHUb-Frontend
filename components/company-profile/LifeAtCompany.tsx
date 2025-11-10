import React, { useState } from 'react';
import { Company, Value } from '../../types';
import { PlayCircleIcon } from '../icons/PlayCircleIcon';
import ImageLightboxModal from '../modals/ImageLightboxModal';

interface LifeAtCompanyProps {
  company: Company;
  onPlayVideo: (url: string) => void;
}

const ValueCard: React.FC<{ value: Value }> = ({ value }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
        <div className="inline-block bg-blue-100 text-primary p-4 rounded-full mb-4">
            {React.cloneElement(value.icon, { className: "w-8 h-8 text-primary" })}
        </div>
        <h4 className="font-bold text-lg text-neutral-dark">{value.title}</h4>
        <p className="text-sm text-gray-600 mt-2">{value.description}</p>
    </div>
);

const LifeAtCompany: React.FC<LifeAtCompanyProps> = ({ company, onPlayVideo }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="space-y-12">
      {/* Values */}
      {company.values && company.values.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-neutral-dark mb-6 text-center">Our Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {company.values.map(value => <ValueCard key={value.title} value={value} />)}
          </div>
        </section>
      )}

       {/* Benefits */}
      {company.benefits && company.benefits.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-neutral-dark mb-6 text-center">Perks & Benefits</h3>
          <div className="bg-neutral-light rounded-lg p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            {company.benefits.map(benefit => (
                 <div key={benefit} className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-accent flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    <span>{benefit}</span>
                </div>
            ))}
          </div>
        </section>
      )}

      {/* A Day in the Life */}
      {company.dayInTheLife && (
        <section>
          <h3 className="text-xl font-bold text-neutral-dark mb-4">A Day in the Life</h3>
          <p className="text-gray-600 leading-relaxed bg-neutral-light p-6 rounded-lg">{company.dayInTheLife}</p>
        </section>
      )}

      {/* Photo Gallery */}
      {company.photoGallery && company.photoGallery.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-neutral-dark mb-4">Photo Gallery</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {company.photoGallery.map((url, index) => (
              <div key={index} className="group aspect-w-1 aspect-h-1" onClick={() => setSelectedImage(url)}>
                <img src={url} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover rounded-lg cursor-pointer transform group-hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Employee Testimonials */}
      {company.employeeTestimonials && company.employeeTestimonials.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-neutral-dark mb-4">Hear From Our Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {company.employeeTestimonials.map(video => (
              <div key={video.id} className="group cursor-pointer" onClick={() => onPlayVideo(video.videoUrl)}>
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <PlayCircleIcon className="w-20 h-20 text-white/80" />
                    </div>
                </div>
                <div className="mt-4">
                    <h4 className="font-bold text-lg text-neutral-dark">{`"${video.title}"`}</h4>
                    <p className="text-sm text-gray-500">{video.employeeName}, {video.employeeTitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedImage && (
        <ImageLightboxModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
};

export default LifeAtCompany;