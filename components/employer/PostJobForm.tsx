import React, { useState } from 'react';
import { createJob } from '../../src/api/jobsApi';
import { useSharedJobsStore } from '../../stores/useSharedJobsStore';

interface PostJobFormProps {
  onJobPosted: () => void;
}

const PostJobForm: React.FC<PostJobFormProps> = ({ onJobPosted }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    companyLogo: '',
    location: '',
    type: 'Full-time' as const,
    salary: '',
    salaryMin: '',
    salaryMax: '',
    description: '',
    responsibilities: '',
    qualifications: '',
    benefits: '',
    skills: '',
    seniority: 'Mid' as const,
    isRemote: false,
    workplaceType: 'On-site' as 'On-site' | 'Remote' | 'Hybrid',
    employmentType: 'Full-time' as const,
    applicationDeadline: '',
    status: 'Published' as const
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
      const salary = formData.salaryMin && formData.salaryMax 
        ? `$${formData.salaryMin} - $${formData.salaryMax}`
        : formData.salary;
      
      const job = await createJob({
        title: formData.title,
        company: formData.company,
        location: formData.location,
        type: formData.employmentType,
        salary: salary,
        description: formData.description,
        skills: skillsArray,
        status: formData.status,
        seniority: formData.seniority,
        isRemote: formData.workplaceType === 'Remote',
        logo: formData.companyLogo || undefined
      });
      
      console.log('✅ Job posted:', job);
      
      // Map backend response to frontend Job type
      const mappedJob = {
        id: job.id,
        title: job.title,
        company: job.company,
        companyId: job.companyId || '',
        logo: formData.companyLogo || job.logo || 'https://picsum.photos/seed/' + job.company + '/100/100',
        location: formData.workplaceType === 'Remote' ? 'Remote' : job.location,
        type: job.type as any,
        salary: salary,
        posted: 'Just now',
        description: job.description,
        responsibilities: formData.responsibilities,
        skills: job.skills,
        benefits: formData.benefits ? formData.benefits.split('\n').filter(b => b.trim()) : [],
        status: job.status as any,
        applicationsCount: 0,
        viewsCount: 0,
        seniority: job.seniority as any
      };
      
      // Add to shared store so job seekers can see it immediately
      const { addJob } = useSharedJobsStore.getState();
      addJob(mappedJob);
      console.log('➕ Added job to shared store for job seekers');
      
      setSuccess(true);
      setTimeout(() => {
        // Reset form
        setFormData({
          title: '',
          company: '',
          companyLogo: '',
          location: '',
          type: 'Full-time',
          salary: '',
          salaryMin: '',
          salaryMax: '',
          description: '',
          responsibilities: '',
          qualifications: '',
          benefits: '',
          skills: '',
          seniority: 'Mid',
          isRemote: false,
          workplaceType: 'On-site',
          employmentType: 'Full-time',
          applicationDeadline: '',
          status: 'Published'
        });
        setCurrentStep(1);
        setSuccess(false);
        onJobPosted();
      }, 2000);
      
    } catch (error: any) {
      console.error('❌ Failed to post job:', error);
      setError(error.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Full-Screen Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="relative">
              {/* Animated Spinner */}
              <div className="w-20 h-20 mx-auto mb-6">
                <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              
              {/* Progress Animation */}
              <div className="mb-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Publishing Your Job</h3>
                <p className="text-gray-600 text-sm">
                  Please wait while we post your job to thousands of candidates...
                </p>
              </div>

              {/* Steps Indicator */}
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Validating job details</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 bg-blue-500 rounded-full animate-pulse flex-shrink-0"></div>
                  <span className="text-gray-700">Posting to job board</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 bg-gray-300 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-400">Notifying candidates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <h2 className="text-3xl font-bold text-white">Post a Job</h2>
          <p className="text-blue-100 mt-2">Find the perfect candidate for your team</p>
        </div>

        {/* Progress Steps */}
        <div className="px-8 py-6 bg-gray-50 border-b">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    currentStep >= step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    currentStep >= step ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step === 1 ? 'Basic Info' : step === 2 ? 'Job Details' : 'Review'}
                  </span>
                </div>
                {step < 3 && (
                  <div className={`h-1 flex-1 mx-2 rounded ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mx-8 mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-semibold text-green-900">Job Posted Successfully!</p>
              <p className="text-sm text-green-700">Your job is now live and visible to candidates.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mx-8 mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g. Senior Software Engineer"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">A clear job title helps attract the right candidates</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Google Inc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Logo URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.companyLogo}
                  onChange={(e) => setFormData({...formData, companyLogo: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                />
                {formData.companyLogo && (
                  <div className="mt-3 flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <img 
                      src={formData.companyLogo} 
                      alt="Company logo preview" 
                      className="w-16 h-16 object-contain rounded-lg bg-white border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/100?text=Invalid+URL';
                      }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">Logo Preview</p>
                      <p className="text-xs text-gray-500">This is how your logo will appear</p>
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">Paste your company logo URL (e.g., from your website or LinkedIn)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Workplace Type *
                  </label>
                  <select
                    value={formData.workplaceType}
                    onChange={(e) => setFormData({...formData, workplaceType: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={formData.workplaceType === 'Remote' ? 'Anywhere' : 'e.g. New York, NY'}
                    required={formData.workplaceType !== 'Remote'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Employment Type *
                  </label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => setFormData({...formData, employmentType: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Experience Level *
                  </label>
                  <select
                    value={formData.seniority}
                    onChange={(e) => setFormData({...formData, seniority: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Entry">Entry Level</option>
                    <option value="Junior">Junior</option>
                    <option value="Mid">Mid-Level</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead/Principal</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Salary Range (Optional)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500">$</span>
                    <input
                      type="text"
                      value={formData.salaryMin}
                      onChange={(e) => setFormData({...formData, salaryMin: e.target.value})}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Min (e.g. 80,000)"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500">$</span>
                    <input
                      type="text"
                      value={formData.salaryMax}
                      onChange={(e) => setFormData({...formData, salaryMax: e.target.value})}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Max (e.g. 120,000)"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Jobs with salary info get 3x more applications</p>
              </div>
            </div>
          )}

          {/* Step 2: Job Details */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={5}
                  placeholder="Describe the role, what the candidate will do, and why they should join your team..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Key Responsibilities
                </label>
                <textarea
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({...formData, responsibilities: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="• Design and develop scalable applications&#10;• Collaborate with cross-functional teams&#10;• Mentor junior developers"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Required Skills *
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. React, TypeScript, Node.js, AWS (comma-separated)"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Qualifications & Requirements
                </label>
                <textarea
                  value={formData.qualifications}
                  onChange={(e) => setFormData({...formData, qualifications: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="• Bachelor's degree in Computer Science or related field&#10;• 5+ years of professional experience&#10;• Strong problem-solving skills"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Benefits & Perks
                </label>
                <textarea
                  value={formData.benefits}
                  onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Health insurance&#10;401(k) matching&#10;Flexible work hours&#10;Professional development budget"
                />
                <p className="text-xs text-gray-500 mt-1">One benefit per line</p>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Review Your Job Posting</h3>
                
                <div className="space-y-4">
                  {formData.companyLogo && (
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <img 
                        src={formData.companyLogo} 
                        alt="Company logo" 
                        className="w-16 h-16 object-contain rounded-lg bg-white border border-gray-200"
                      />
                      <div>
                        <p className="font-medium text-gray-700">Company Logo</p>
                        <p className="text-sm text-gray-500">Will be displayed with your job posting</p>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium text-gray-700">Job Title:</span>
                    <span className="text-gray-900">{formData.title}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium text-gray-700">Company:</span>
                    <span className="text-gray-900">{formData.company}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium text-gray-700">Location:</span>
                    <span className="text-gray-900">{formData.workplaceType === 'Remote' ? 'Remote' : formData.location}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="text-gray-900">{formData.employmentType} • {formData.workplaceType}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium text-gray-700">Experience:</span>
                    <span className="text-gray-900">{formData.seniority}</span>
                  </div>
                  {(formData.salaryMin || formData.salaryMax) && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium text-gray-700">Salary:</span>
                      <span className="text-green-600 font-semibold">
                        ${formData.salaryMin} - ${formData.salaryMax}
                      </span>
                    </div>
                  )}
                  <div className="py-2">
                    <span className="font-medium text-gray-700 block mb-2">Skills:</span>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.split(',').map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3 mb-6">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold">Before you publish:</p>
                  <p>Make sure all information is accurate. You can edit this job posting later from your dashboard.</p>
                </div>
              </div>

              {/* JOB PREVIEW - How it will look to candidates */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-900">Preview</h4>
                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                    How candidates will see it
                  </span>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-1 bg-gray-50">
                  {/* Job Card Preview */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-4">
                      <div className="relative">
                        <img
                          src={formData.companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.company)}&background=0D8ABC&color=fff&size=64`}
                          alt={`${formData.company} logo`}
                          className="w-16 h-16 rounded-xl mr-4 ring-2 ring-gray-100"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.company)}&background=0D8ABC&color=fff&size=64`;
                          }}
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
                          {formData.title || 'Job Title'}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {formData.company || 'Company Name'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{formData.workplaceType === 'Remote' ? 'Remote' : formData.location || 'Location'}</span>
                      </div>

                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-green-100 text-green-800 border-green-200">
                          {formData.employmentType}
                        </span>
                      </div>

                      {(formData.salaryMin || formData.salaryMax) && (
                        <div className="flex items-center text-gray-600">
                          <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1" />
                          </svg>
                          <span className="font-medium text-green-700">
                            ${formData.salaryMin} - ${formData.salaryMax}
                          </span>
                        </div>
                      )}

                      {formData.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 mt-3">
                          {formData.description}
                        </p>
                      )}

                      {formData.skills && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {formData.skills.split(',').slice(0, 4).map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                              {skill.trim()}
                            </span>
                          ))}
                          {formData.skills.split(',').length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                              +{formData.skills.split(',').length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Posted just now
                      </span>
                      <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-3 text-center">
                  ↑ This is exactly how your job will appear in search results
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <div className="flex gap-3">
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Publish Job
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobForm;
