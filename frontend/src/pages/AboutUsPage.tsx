import React from 'react';
import { Link } from 'react-router-dom';

const AboutUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto">
              Empowering students everywhere with life-saving disaster readiness knowledge
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Mission */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-red-600">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 rounded-full p-3 mr-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              To create a disaster-resilient generation by educating and empowering students, teachers,
              and families with comprehensive disaster readiness knowledge through innovative,
              interactive, and accessible digital learning experiences.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-orange-600">
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 rounded-full p-3 mr-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              A future where every student is equipped with the knowledge and skills to
              respond effectively to disasters, creating safer communities and saving lives through
              education and preparedness.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Schools Registered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">10,000+</div>
              <div className="text-gray-600 font-medium">Students Trained</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">50,000+</div>
              <div className="text-gray-600 font-medium">Drills Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">100+</div>
              <div className="text-gray-600 font-medium">Districts Covered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              Founded in 2026, Disaster Ready was born from a critical
              need to enhance disaster readiness in educational institutions across India. Recognizing
              that students are not only vulnerable during disasters but also powerful agents of change
              in their communities, we set out to create a comprehensive digital solution.
            </p>
            <p className="mb-4">
              Our platform combines cutting-edge technology with proven disaster management principles,
              delivering engaging, interactive learning experiences that resonate with today's digital-native
              students. From earthquake safety to flood preparedness, we cover all major disaster scenarios
              relevant to India's diverse geographical and climatic contexts.
            </p>
            <p>
              Through partnerships with educational institutions, disaster management authorities, and
              technology experts, we continue to evolve our platform, ensuring it remains at the forefront
              of disaster preparedness education in India.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Team</h2>
        <div className="grid md:grid-cols-4 gap-8">

          {/* Sheldon Patel - Team Leader */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 h-32"></div>
            <div className="p-6 text-center -mt-16">
              <div className="w-24 h-24 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-red-600 border-4 border-white">
                SP
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Sheldon Patel</h3>
              <p className="text-red-600 font-medium mb-3 text-sm">Team Leader</p>
              <p className="text-gray-600 text-sm">
                Leading the vision and development of the Disaster Ready platform.
              </p>
            </div>
          </div>

          {/* Joy Nigrel */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 h-32"></div>
            <div className="p-6 text-center -mt-16">
              <div className="w-24 h-24 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-orange-600 border-4 border-white">
                JN
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Joy Nigrel</h3>
              <p className="text-orange-600 font-medium mb-3 text-sm">Team Member</p>
              <p className="text-gray-600 text-sm">
                Contributing to the design and development of key platform features.
              </p>
            </div>
          </div>

          {/* Conroy Yarde */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-600 h-32"></div>
            <div className="p-6 text-center -mt-16">
              <div className="w-24 h-24 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-yellow-700 border-4 border-white">
                CY
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Conroy Yarde</h3>
              <p className="text-yellow-700 font-medium mb-3 text-sm">Team Member</p>
              <p className="text-gray-600 text-sm">
                Helping build and refine the interactive learning experiences.
              </p>
            </div>
          </div>

          {/* Swaroop Shelke */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-r from-amber-600 to-red-600 h-32"></div>
            <div className="p-6 text-center -mt-16">
              <div className="w-24 h-24 bg-amber-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-amber-700 border-4 border-white">
                SS
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Swaroop Shelke</h3>
              <p className="text-amber-700 font-medium mb-3 text-sm">Team Member</p>
              <p className="text-gray-600 text-sm">
                Supporting the backend architecture and data management systems.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Safety First</h3>
              <p className="text-gray-600 text-sm">
                Every decision prioritizes the safety and well-being of students and communities.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Education</h3>
              <p className="text-gray-600 text-sm">
                Knowledge is power. We believe in making quality education accessible to all.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600 text-sm">
                Leveraging technology to create engaging and effective learning experiences.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600 text-sm">
                Building strong, resilient communities through collective preparedness.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Us in Building a Safer Future</h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Together, we can create disaster-resilient communities through education and preparedness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors inline-block"
            >
              Get Started Today
            </Link>
            <Link
              to="/contact"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors inline-block"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
