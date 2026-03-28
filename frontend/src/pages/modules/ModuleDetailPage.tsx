import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DisasterModule } from '../../types';
import VideoPlayer from '../../components/common/VideoPlayer';
import { moduleService } from '../../services/moduleService';
import { useAuth } from '../../contexts/AuthContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const TABS = ['overview', 'content', 'videos', 'quiz'] as const;
type TabType = typeof TABS[number];

const getCertificateTheme = (type: string) => {
  switch (type) {
    case 'earthquake':
      return {
        primary: 'text-amber-800',
        secondary: 'text-amber-600',
        bg: 'bg-amber-50',
        borderOuter: '#92400e', // amber-800
        borderInner: '#fcd34d', // amber-300
        svgColor: 'text-amber-600',
        sealBg: 'bg-amber-100',
        sealBorder: 'border-amber-500',
        sealText: 'text-amber-600',
        pattern: 'bg-[radial-gradient(#fcd34d_2px,transparent_2px)] [background-size:24px_24px]'
      };
    case 'flood':
      return {
        primary: 'text-blue-900',
        secondary: 'text-blue-600',
        bg: 'bg-indigo-50',
        borderOuter: '#1e3a8a', // blue-900
        borderInner: '#93c5fd', // blue-300
        svgColor: 'text-blue-600',
        sealBg: 'bg-blue-100',
        sealBorder: 'border-blue-500',
        sealText: 'text-blue-600',
        pattern: 'bg-[linear-gradient(0deg,transparent_24%,#bfdbfe_25%,#bfdbfe_26%,transparent_27%,transparent_74%,#bfdbfe_75%,#bfdbfe_76%,transparent_77%,transparent)] [background-size:40px_40px]'
      };
    case 'fire':
      return {
        primary: 'text-red-900',
        secondary: 'text-red-600',
        bg: 'bg-orange-50',
        borderOuter: '#7f1d1d', // red-900
        borderInner: '#fca5a5', // red-300
        svgColor: 'text-red-600',
        sealBg: 'bg-red-100',
        sealBorder: 'border-red-500',
        sealText: 'text-red-600',
        pattern: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-200 via-transparent to-transparent'
      };
    case 'cyclone':
    case 'tornado':
      return {
        primary: 'text-slate-900',
        secondary: 'text-slate-600',
        bg: 'bg-slate-50',
        borderOuter: '#0f172a', // slate-900
        borderInner: '#94a3b8', // slate-400
        svgColor: 'text-slate-600',
        sealBg: 'bg-slate-200',
        sealBorder: 'border-slate-500',
        sealText: 'text-slate-600',
        pattern: 'bg-[repeating-radial-gradient(circle_at_0_0,transparent_0,#e2e8f0_10px,transparent_20px)]'
      };
    case 'gas_leak':
    case 'building_collapse':
      return {
        primary: 'text-yellow-900',
        secondary: 'text-yellow-700',
        bg: 'bg-yellow-50',
        borderOuter: '#713f12', // yellow-900
        borderInner: '#fde047', // yellow-300
        svgColor: 'text-yellow-700',
        sealBg: 'bg-yellow-100',
        sealBorder: 'border-yellow-600',
        sealText: 'text-yellow-700',
        pattern: 'bg-[linear-gradient(45deg,#fef08a_25%,transparent_25%,transparent_50%,#fef08a_50%,#fef08a_75%,transparent_75%,transparent)] [background-size:20px_20px]'
      };
    default:
      return {
        primary: 'text-emerald-900',
        secondary: 'text-emerald-600',
        bg: 'bg-emerald-50',
        borderOuter: '#064e3b', // emerald-900
        borderInner: '#6ee7b7', // emerald-300
        svgColor: 'text-emerald-600',
        sealBg: 'bg-emerald-100',
        sealBorder: 'border-emerald-500',
        sealText: 'text-emerald-600',
        pattern: 'bg-[radial-gradient(#a7f3d0_2px,transparent_2px)] [background-size:24px_24px]'
      };
  }
};

const ModuleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [module, setModule] = useState<DisasterModule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [visitedTabs, setVisitedTabs] = useState<Set<TabType>>(() => new Set<TabType>(['overview']));
  const [userRating, setUserRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  // Compute progress as percentage of tabs visited unless already completed
  const progress = isCompleted ? 100 : Math.round((visitedTabs.size / TABS.length) * 100);
  const [speakingSection, setSpeakingSection] = useState<string | null>(null);

  useEffect(() => {
    // Stop speaking if component unmounts
    return () => window.speechSynthesis.cancel();
  }, []);

  const handleSpeak = (title: string, items: string[]) => {
    if (speakingSection === title) {
      window.speechSynthesis.cancel();
      setSpeakingSection(null);
      return;
    }

    window.speechSynthesis.cancel();
    setSpeakingSection(title);

    const utterance = new SpeechSynthesisUtterance(`${title}. ${items.join('. ')}`);
    utterance.rate = 0.9;
    utterance.onend = () => setSpeakingSection(null);
    utterance.onerror = () => setSpeakingSection(null);
    window.speechSynthesis.speak(utterance);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setVisitedTabs(prev => {
      const updated = new Set(prev);
      updated.add(tab);
      return updated;
    });
  };

  useEffect(() => {
    const loadModule = async () => {
      if (!id) return;

      setIsLoading(true);

      try {
        console.log('✅ ModuleDetailPage: Attempting to load module with ID:', id);

        // Fetch module and progress concurrently
        const [module, userProgress] = await Promise.all([
          moduleService.getModuleById(id),
          moduleService.getUserProgress(id)
        ]);

        if (userProgress === 100) {
          setIsCompleted(true);
          setVisitedTabs(new Set<TabType>(['overview', 'content', 'videos', 'quiz']));
        }

        console.log('✅ ModuleDetailPage: Loaded module from API:', module);
        console.log('✅ ModuleDetailPage: Module content:', module.content);
        console.log('✅ ModuleDetailPage: Module content videos:', module.content?.videos);

        if ((module as any).videos) {
          console.log('✅ ModuleDetailPage: Module has', (module as any).videos.length, 'videos:', (module as any).videos.map((v: any) => v.title));
        } else if (module.content?.videos) {
          console.log('✅ ModuleDetailPage: Module has', module.content.videos.length, 'videos in content.videos:', module.content.videos.map((v: any) => v.title));
        } else {
          console.log('⚠️ ModuleDetailPage: Module has NO videos in either module.videos or content.videos');
        }

        setModule(module);
        return; // Exit here - don't fall back to mock data
      } catch (error) {
        console.error('❌ ModuleDetailPage: Error loading module from API:', error);

        // Try to fetch all modules and find the one we need
        try {
          const allModules = await moduleService.getAllModules();
          const foundModule = allModules.find(m => m._id === id);

          // Validate that the found module has the necessary content structure
          if (foundModule && foundModule.content && foundModule.content.introduction) {
            console.log('✅ Found valid module in all modules list:', foundModule);
            setModule(foundModule);
            return;
          } else if (foundModule) {
            console.warn('⚠️ Found module but content is missing/incomplete:', foundModule);
          }
        } catch (error2) {
          console.error('❌ Error loading all modules:', error2);
        }

        // Fallback to mock data removed because the 9 core modules are fully seeded into the database.
        // If it got here, the module truly does not exist in the database.
        console.error('Module not found in database.');
      } finally {
        setIsLoading(false);
      }
    };

    loadModule();
  }, [id]);

  // Set selectedVideo when module is loaded
  useEffect(() => {
    if (module && module.content.videos && module.content.videos.length > 0) {
      setSelectedVideo(module.content.videos[0]);
    }
  }, [module]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'earthquake': return '🌍';
      case 'flood': return '🌊';
      case 'fire': return '🔥';
      case 'cyclone': return '🌪️';
      case 'drought': return '☀️';
      case 'heatwave': return '🌡️';
      case 'tornado': return '🌪️';
      case 'gas_leak': return '☢️';
      case 'building_collapse': return '🏚️';
      default: return '⚠️';
    }
  };

  const handleRatingSubmit = async (ratingIndex: number) => {
    if (ratingSubmitted || !module?._id) return;
    setUserRating(ratingIndex);
    setRatingSubmitted(true);
    await moduleService.rateModule(module._id, ratingIndex);
  };

  const generateCertificate = async () => {
    if (!certRef.current || !module || !user) return;
    setIsGeneratingCert(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: [canvas.width / 2, canvas.height / 2],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`Certificate - ${module.title}.pdf`);
    } catch (err) {
      console.error('Certificate generation failed:', err);
      alert('Failed to generate certificate. Please try again.');
    } finally {
      setIsGeneratingCert(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading module...</p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Module not found</h1>
          <Link to="/modules" className="text-red-600 hover:text-red-700">
            ← Back to modules
          </Link>
        </div>
      </div>
    );
  }

  const certTheme = getCertificateTheme(module.type);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <Link to="/modules" className="text-red-600 hover:text-red-700 font-medium text-sm mb-4 inline-block flex items-center">
                  <span className="mr-1">←</span> Back to Modules
                </Link>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{getTypeIcon(module.type)}</span>
                  <h1 className="text-3xl font-bold text-gray-900">{module.title}</h1>
                </div>
                <div className="flex items-center mt-3 space-x-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getDifficultyColor(module.difficulty)}`}>
                    {module.difficulty}
                  </span>
                  <div className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {Math.ceil((module.estimatedTime || 0) / 4)} min
                  </div>
                  <div className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    {module.totalQuizPoints} pts
                  </div>
                </div>
                <p className="text-gray-600 max-w-3xl mt-4">{module.description}</p>
              </div>

              {progress === 100 && user && (
                <button
                  onClick={generateCertificate}
                  disabled={isGeneratingCert}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 disabled:opacity-60 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center gap-2 transform transition hover:scale-105"
                >
                  <span className="text-xl">{isGeneratingCert ? '⏳' : '🎓'}</span>
                  {isGeneratingCert ? 'Generating...' : 'Download Certificate'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{progress}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 rounded-xl p-6 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{module.completions?.toLocaleString()}</div>
              <div className="text-sm font-medium text-gray-600">Completed</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-gray-900 mb-1 flex justify-center items-center">
                {module.ratings}
                <span className="text-yellow-400 ml-1 text-2xl">★</span>
              </div>
              <div className="text-sm font-medium text-gray-600 mb-2">Average Rating</div>

              {/* Interactive Star Rating */}
              <div className="mt-2 pt-2 border-t border-gray-200">
                {ratingSubmitted ? (
                  <div className="text-center">
                    <p className="text-xs text-green-600 font-semibold mb-1">✅ Thanks for rating!</p>
                    <div className="flex justify-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className={`w-5 h-5 ${star <= userRating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Rate this module</p>
                    <div className="flex justify-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRatingSubmit(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <svg
                            className={`w-6 h-6 ${(hoveredRating || userRating) >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{module.totalQuizPoints}</div>
              <div className="text-sm font-medium text-gray-600">Points Available</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex justify-center space-x-8 px-6">
                {[
                  { id: 'overview' as TabType, label: 'Overview' },
                  { id: 'content' as TabType, label: 'Learning Content' },
                  { id: 'videos' as TabType, label: 'Video Lessons' },
                  { id: 'quiz' as TabType, label: 'Quiz' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-1.5 ${activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    {tab.label}
                    {visitedTabs.has(tab.id) && tab.id !== activeTab && (
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-8">
              {activeTab === 'overview' && (
                <div className="max-w-6xl mx-auto space-y-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Course Overview</h3>
                    <p className="text-gray-700 leading-relaxed text-lg max-w-4xl mx-auto">{module.content.introduction}</p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center border-b pb-4">What You Will Learn</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                      {module.content.keyPoints.map((point, index) => (
                        <div key={index} className="flex items-start bg-gray-50 rounded-xl p-4 transition duration-300 hover:shadow-md border border-gray-100">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 shadow-sm">
                            {index + 1}
                          </div>
                          <span className="text-gray-700 text-base font-medium leading-relaxed pt-1.5">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="space-y-10 max-w-7xl mx-auto">
                  <div className="text-center mb-2">
                    <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">Survival Action Plan</h3>
                    <p className="text-gray-500 mt-2 text-lg">Master the crucial steps to take before, during, and after an event.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Before Disaster */}
                    <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col group">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 shrink-0 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white flex items-center">
                          <span className="text-2xl mr-2">🛡️</span> Preparation
                        </h3>
                        <button
                          onClick={() => handleSpeak('Preparation', module.content.preventionMeasures)}
                          className={`p-2 rounded-full transition-colors ${speakingSection === 'Preparation' ? 'bg-white text-emerald-600 shadow-md' : 'bg-white/20 hover:bg-white/30 text-white'}`}
                          title="Listen to this section"
                        >
                          {speakingSection === 'Preparation' ? '⏹️' : '🔊'}
                        </button>
                      </div>
                      <div className="p-6 bg-green-50/50 flex-1">
                        <ul className="space-y-4">
                          {module.content.preventionMeasures.map((measure, index) => (
                            <li key={index} className="flex items-start bg-white p-3 rounded-lg border border-green-100 shadow-sm transition-all group-hover:border-green-300">
                              <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 mt-0.5 border border-green-200">✓</span>
                              <span className="text-gray-700 font-medium leading-relaxed">{measure}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* During Disaster */}
                    <div className="bg-white rounded-2xl shadow-lg border border-red-100 overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col group">
                      <div className="bg-gradient-to-r from-red-600 to-orange-500 p-4 shrink-0 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white flex items-center">
                          <span className="text-2xl mr-2">⚠️</span> Immediate Action
                        </h3>
                        <button
                          onClick={() => handleSpeak('Immediate Action', module.content.duringDisaster)}
                          className={`p-2 rounded-full transition-colors ${speakingSection === 'Immediate Action' ? 'bg-white text-red-600 shadow-md' : 'bg-white/20 hover:bg-white/30 text-white'}`}
                          title="Listen to this section"
                        >
                          {speakingSection === 'Immediate Action' ? '⏹️' : '🔊'}
                        </button>
                      </div>
                      <div className="p-6 bg-red-50/50 flex-1">
                        <ul className="space-y-4">
                          {module.content.duringDisaster.map((action, index) => (
                            <li key={index} className="flex items-start bg-white p-3 rounded-lg border border-red-100 shadow-sm transition-all group-hover:border-red-300">
                              <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-3 mt-0.5 border border-red-200">⚡</span>
                              <span className="text-gray-700 font-medium leading-relaxed">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* After Disaster */}
                    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col group">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 shrink-0 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white flex items-center">
                          <span className="text-2xl mr-2">🛠️</span> Safe Recovery
                        </h3>
                        <button
                          onClick={() => handleSpeak('Safe Recovery', module.content.afterDisaster)}
                          className={`p-2 rounded-full transition-colors ${speakingSection === 'Safe Recovery' ? 'bg-white text-blue-600 shadow-md' : 'bg-white/20 hover:bg-white/30 text-white'}`}
                          title="Listen to this section"
                        >
                          {speakingSection === 'Safe Recovery' ? '⏹️' : '🔊'}
                        </button>
                      </div>
                      <div className="p-6 bg-blue-50/50 flex-1">
                        <ul className="space-y-4">
                          {module.content.afterDisaster.map((action, index) => (
                            <li key={index} className="flex items-start bg-white p-3 rounded-lg border border-blue-100 shadow-sm transition-all group-hover:border-blue-300">
                              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5 border border-blue-200">ℹ️</span>
                              <span className="text-gray-700 font-medium leading-relaxed">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'videos' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Video Lessons</h3>
                    <p className="text-gray-600 mb-6">
                      Watch these educational videos to better understand disaster preparedness techniques.
                    </p>
                  </div>

                  {/* Featured Video Player */}
                  {selectedVideo && (
                    <div className="mb-8">
                      <VideoPlayer
                        src={selectedVideo.url}
                        poster={selectedVideo.thumbnail}
                        title={selectedVideo.title}
                        description={selectedVideo.description}
                        className="w-full h-96 mb-4"
                        onVideoEnd={() => {
                          // Track completion and possibly auto-advance to next video
                          console.log('Video completed:', selectedVideo.id);
                        }}
                        onVideoProgress={(current, duration) => {
                          // Track progress for analytics
                          const progress = (current / duration) * 100;
                          if (progress > 80) {
                            console.log('Video mostly watched:', selectedVideo.id);
                          }
                        }}
                      />
                    </div>
                  )}

                  {/* Video Categories */}
                  {!module.content.videos?.length ? (
                    <div className="text-center py-12">
                      <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Videos Available</h3>
                      <p className="text-gray-600 mb-6">Video content is being prepared for this module. Please check back later or contact your instructor.</p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                        <p className="text-sm text-blue-800">In the meantime, you can:</p>
                        <ul className="text-sm text-blue-700 mt-2 space-y-1">
                          <li>• Review the learning content in the other tabs</li>
                          <li>• Take notes on the key concepts</li>
                          <li>• Discuss with your instructor</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-10">
                      {/* Introduction Videos */}
                      {(module.content.videos?.filter((video: any) => video.section === 'introduction').length || 0) > 0 && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                          <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg font-semibold mr-4 shadow-sm">
                              📚
                            </span>
                            Introduction & Basics
                            <span className="ml-auto bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                              {module.content.videos?.filter((video: any) => video.section === 'introduction').length} videos
                            </span>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {module.content.videos
                              ?.filter((video: any) => video.section === 'introduction')
                              .map((video: any) => (
                                <div
                                  key={video.id}
                                  className={`bg-white border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${selectedVideo?.id === video.id
                                    ? 'border-red-500 shadow-xl ring-2 ring-red-200 bg-red-50'
                                    : 'border-gray-200 hover:border-blue-300 shadow-sm'
                                    }`}
                                  onClick={() => setSelectedVideo(video)}
                                >
                                  <div className="relative mb-4 group">
                                    <img
                                      src={video.thumbnail}
                                      alt={video.title}
                                      className="w-full h-40 object-cover rounded-lg transition-all duration-300 group-hover:brightness-75"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x240/f3f4f6/6b7280?text=Video+Thumbnail';
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg flex items-center justify-center transition-all duration-300">
                                      <div className={`bg-red-600 text-white rounded-full p-3 transform transition-all duration-300 ${selectedVideo?.id === video.id ? 'scale-110 bg-red-700' : 'group-hover:scale-110'
                                        } shadow-lg`}>
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M8 5v14l11-7z" />
                                        </svg>
                                      </div>
                                    </div>
                                    <div className="absolute top-2 left-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                                      {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                                    </div>
                                    {selectedVideo?.id === video.id && (
                                      <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                                        Now Playing
                                      </div>
                                    )}
                                  </div>
                                  <div className="space-y-2">
                                    <h5 className={`font-semibold text-gray-900 line-clamp-2 leading-tight ${selectedVideo?.id === video.id ? 'text-red-900' : ''
                                      }`}>
                                      {video.title}
                                    </h5>
                                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                      {video.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Prevention Videos */}
                      {(module.content.videos?.filter((video: any) => video.section === 'preventionMeasures').length || 0) > 0 && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                          <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <span className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-lg font-semibold mr-4 shadow-sm">
                              🛡️
                            </span>
                            Prevention & Preparedness
                            <span className="ml-auto bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                              {module.content.videos?.filter((video: any) => video.section === 'preventionMeasures').length} videos
                            </span>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {module.content.videos
                              ?.filter((video: any) => video.section === 'preventionMeasures')
                              .map((video: any) => (
                                <div
                                  key={video.id}
                                  className={`bg-white border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${selectedVideo?.id === video.id ? 'border-red-500 shadow-md' : 'border-gray-200'
                                    }`}
                                  onClick={() => setSelectedVideo(video)}
                                >
                                  <div className="relative mb-3">
                                    <img
                                      src={video.thumbnail}
                                      alt={video.title}
                                      className="w-full h-32 object-cover rounded-md"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-md flex items-center justify-center">
                                      <div className="bg-red-600 bg-opacity-90 text-white rounded-full p-2">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M8 5v14l11-7z" />
                                        </svg>
                                      </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                      {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                                    </div>
                                  </div>
                                  <h5 className="font-medium text-gray-900 mb-1">{video.title}</h5>
                                  <p className="text-sm text-gray-600">{video.description}</p>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* During Disaster Videos */}
                      {(module.content.videos?.filter((video: any) => video.section === 'duringDisaster').length || 0) > 0 && (
                        <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-6 border border-red-200">
                          <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <span className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-lg font-semibold mr-4 shadow-sm">
                              ⚠️
                            </span>
                            Emergency Response
                            <span className="ml-auto bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                              {module.content.videos?.filter((video: any) => video.section === 'duringDisaster').length} videos
                            </span>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {module.content.videos
                              ?.filter((video: any) => video.section === 'duringDisaster')
                              .map((video: any) => (
                                <div
                                  key={video.id}
                                  className={`bg-white border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${selectedVideo?.id === video.id ? 'border-red-500 shadow-md' : 'border-gray-200'
                                    }`}
                                  onClick={() => setSelectedVideo(video)}
                                >
                                  <div className="relative mb-3">
                                    <img
                                      src={video.thumbnail}
                                      alt={video.title}
                                      className="w-full h-32 object-cover rounded-md"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-md flex items-center justify-center">
                                      <div className="bg-red-600 bg-opacity-90 text-white rounded-full p-2">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M8 5v14l11-7z" />
                                        </svg>
                                      </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                      {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                                    </div>
                                  </div>
                                  <h5 className="font-medium text-gray-900 mb-1">{video.title}</h5>
                                  <p className="text-sm text-gray-600">{video.description}</p>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* After Disaster Videos */}
                      {(module.content.videos?.filter((video: any) => video.section === 'afterDisaster').length || 0) > 0 && (
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                          <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <span className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-lg font-semibold mr-4 shadow-sm">
                              🛠️
                            </span>
                            Recovery & Aftermath
                            <span className="ml-auto bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                              {module.content.videos?.filter((video: any) => video.section === 'afterDisaster').length} videos
                            </span>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {module.content.videos
                              ?.filter((video: any) => video.section === 'afterDisaster')
                              .map((video: any) => (
                                <div
                                  key={video.id}
                                  className={`bg-white border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${selectedVideo?.id === video.id ? 'border-red-500 shadow-md' : 'border-gray-200'
                                    }`}
                                  onClick={() => setSelectedVideo(video)}
                                >
                                  <div className="relative mb-3">
                                    <img
                                      src={video.thumbnail}
                                      alt={video.title}
                                      className="w-full h-32 object-cover rounded-md"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-md flex items-center justify-center">
                                      <div className="bg-red-600 bg-opacity-90 text-white rounded-full p-2">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M8 5v14l11-7z" />
                                        </svg>
                                      </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                      {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                                    </div>
                                  </div>
                                  <h5 className="font-medium text-gray-900 mb-1">{video.title}</h5>
                                  <p className="text-sm text-gray-600">{video.description}</p>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Video Learning Tips */}
                      <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-200 rounded-xl p-8 shadow-lg">
                        <div className="flex items-center mb-6">
                          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-2xl mr-4 shadow-sm">
                            🎥
                          </div>
                          <div>
                            <h4 className="text-2xl font-bold text-amber-900 mb-1">Video Learning Tips</h4>
                            <p className="text-amber-700 text-sm">Maximize your learning experience</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start space-x-3 p-3 bg-white bg-opacity-50 rounded-lg">
                            <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                              1
                            </div>
                            <p className="text-amber-800 text-sm font-medium">Watch each video completely for better understanding</p>
                          </div>
                          <div className="flex items-start space-x-3 p-3 bg-white bg-opacity-50 rounded-lg">
                            <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                              2
                            </div>
                            <p className="text-amber-800 text-sm font-medium">Take notes on key techniques and procedures</p>
                          </div>
                          <div className="flex items-start space-x-3 p-3 bg-white bg-opacity-50 rounded-lg">
                            <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                              3
                            </div>
                            <p className="text-amber-800 text-sm font-medium">Practice the techniques shown in the videos</p>
                          </div>
                          <div className="flex items-start space-x-3 p-3 bg-white bg-opacity-50 rounded-lg">
                            <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                              4
                            </div>
                            <p className="text-amber-800 text-sm font-medium">Discuss the content with your teachers and classmates</p>
                          </div>
                          <div className="flex items-start space-x-3 p-3 bg-white bg-opacity-50 rounded-lg md:col-span-2">
                            <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                              5
                            </div>
                            <p className="text-amber-800 text-sm font-medium">Review videos before taking the quiz to reinforce learning</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'quiz' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Module Quiz</h3>
                    <p className="text-gray-600 mb-4">
                      Test your knowledge with this quiz. You need to score at least {module.quiz.passingScore}% to pass.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-blue-800">
                            5 randomly selected questions
                          </p>
                          <p className="text-xs text-blue-600">
                            Passing score: {module.quiz.passingScore}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Link
                      to={`/modules/${module._id}/quiz`}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Start Quiz
                      <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div >

          {/* Action Buttons */}
          < div className="flex flex-col sm:flex-row gap-4 justify-center" >
            <Link
              to="/modules"
              className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              ← Back to Modules
            </Link>

            {
              activeTab === 'quiz' ? (
                <Link
                  to={`/modules/${module._id}/quiz`}
                  className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Start Quiz
                </Link>
              ) : (
                <button
                  onClick={() => {
                    const currentIndex = TABS.indexOf(activeTab);
                    if (currentIndex < TABS.length - 1) {
                      handleTabChange(TABS[currentIndex + 1]);
                    }
                  }}
                  className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Next
                </button>
              )}
          </div>
        </div>

        {/* Off-screen Certificate for PDF Generation */}
        {progress === 100 && user && (
          <div
            ref={certRef}
            id="printable-certificate"
            style={{
              position: 'fixed', left: '-9999px', top: 0, zIndex: -1,
              width: '1122px', height: '794px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: certTheme.borderOuter === '#92400e' ? '#fefce8' :
                certTheme.borderOuter === '#1e3a8a' ? '#eff6ff' :
                  certTheme.borderOuter === '#7f1d1d' ? '#fff7ed' :
                    certTheme.borderOuter === '#0f172a' ? '#f8fafc' :
                      certTheme.borderOuter === '#713f12' ? '#fefce8' : '#f0fdf4',
              border: `16px solid ${certTheme.borderOuter}`,
              boxSizing: 'border-box',
              fontFamily: 'serif',
            }}
          >
            {/* Inner card */}
            <div style={{
              width: '960px',
              background: 'rgba(255,255,255,0.97)',
              border: `4px double ${certTheme.borderInner || '#ccc'}`,
              borderRadius: '12px',
              padding: '40px 60px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '12px',
              position: 'relative',
            }}>
              {/* Corner accents */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: 60, height: 60, borderTop: `8px solid ${certTheme.borderOuter}`, borderLeft: `8px solid ${certTheme.borderOuter}`, borderRadius: '12px 0 0 0' }} />
              <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, borderTop: `8px solid ${certTheme.borderOuter}`, borderRight: `8px solid ${certTheme.borderOuter}`, borderRadius: '0 12px 0 0' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: 60, height: 60, borderBottom: `8px solid ${certTheme.borderOuter}`, borderLeft: `8px solid ${certTheme.borderOuter}`, borderRadius: '0 0 0 12px' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 60, height: 60, borderBottom: `8px solid ${certTheme.borderOuter}`, borderRight: `8px solid ${certTheme.borderOuter}`, borderRadius: '0 0 12px 0' }} />

              {/* Emoji Icon */}
              <div style={{ fontSize: 52, lineHeight: 1.2 }}>{getTypeIcon(module.type)}</div>

              {/* Title */}
              <h1 style={{ margin: 0, fontSize: 36, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: certTheme.borderOuter, fontFamily: 'serif' }}>
                Certificate of Completion
              </h1>

              {/* Sub-title */}
              <p style={{ margin: 0, fontSize: 14, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#6b7280', borderBottom: `2px solid #e5e7eb`, paddingBottom: 10, width: '100%' }}>
                Disaster Ready Foundation
              </p>

              {/* Certify text */}
              <p style={{ margin: 0, fontSize: 16, fontStyle: 'italic', color: '#9ca3af', fontFamily: 'serif' }}>
                This is to proudly certify that
              </p>

              {/* Student name */}
              <h2 style={{ margin: 0, fontSize: 44, fontWeight: 700, color: '#111827', fontFamily: 'serif', borderBottom: `2px solid #d1d5db`, paddingBottom: 8, paddingLeft: 48, paddingRight: 48 }}>
                {user.name}
              </h2>

              {/* Body text */}
              <p style={{ margin: 0, fontSize: 15, color: '#4b5563', maxWidth: 600 }}>
                has successfully completed the comprehensive safety training module for
              </p>

              {/* Module name */}
              <h3 style={{ margin: 0, fontSize: 26, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: certTheme.borderOuter }}>
                {module.title}
              </h3>

              {/* Footer row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 20, paddingTop: 16, borderTop: '2px solid #e5e7eb' }}>
                {/* Date */}
                <div style={{ textAlign: 'center', minWidth: 160 }}>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1f2937', borderBottom: '2px solid #9ca3af', paddingBottom: 4 }}>{new Date().toLocaleDateString()}</p>
                  <p style={{ margin: '4px 0 0', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#9ca3af' }}>Issue Date</p>
                </div>

                {/* Seal */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%',
                    background: certTheme.borderInner || '#fde68a',
                    border: `6px solid ${certTheme.borderOuter}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: certTheme.borderOuter,
                  }}>
                    <svg width="36" height="36" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p style={{ margin: 0, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6b7280' }}>Verified Complete</p>
                </div>

                {/* Signature */}
                <div style={{ textAlign: 'center', minWidth: 160 }}>
                  <p style={{ margin: 0, fontSize: 22, fontStyle: 'italic', fontFamily: 'serif', color: '#1f2937', borderBottom: '2px solid #9ca3af', paddingBottom: 4 }}>Disaster Ready</p>
                  <p style={{ margin: '4px 0 0', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#9ca3af' }}>Program Director</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleDetailPage;
