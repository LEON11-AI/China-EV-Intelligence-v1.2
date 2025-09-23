import React from 'react';
import { ExternalLink, Youtube, Twitter, Linkedin, MapPin, Calendar, Award } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-bg py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-dark-card rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="relative bg-dark-card px-6 py-8 lg:px-8 lg:py-12">
            <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-8">
              {/* Profile Photo */}
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img 
                    src="/images/leon.jpg" 
                    alt="Leon - Founder of VoltChina" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
              </div>
              
              {/* Basic Info */}
              <div className="text-center md:text-left text-text-main flex-grow">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">Leon</h1>
                <p className="text-lg md:text-xl lg:text-2xl text-text-secondary mb-6">Founder & Chief Experience Officer</p>
                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 lg:gap-4 text-text-secondary text-sm lg:text-base">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>Guangzhou, China</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>5+ Years in EV Industry</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <span>VoltChina Creator</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Content */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Story */}
          <div className="lg:col-span-2">
            <div className="bg-dark-card rounded-xl shadow-lg p-6 lg:p-8 h-fit">
              <h2 className="text-2xl lg:text-3xl font-bold text-text-main mb-6">About Me</h2>
              
              <div className="prose prose-lg text-text-main space-y-6 leading-relaxed">
                <p className="text-lg lg:text-xl leading-relaxed">
                  Based in Guangzhou, the epicenter of China's automotive industry transformation, I have witnessed an unprecedented shift of China's new energy vehicles (NEVs) — from being met with skepticism to leading the world. This unique geographical location allows me to deeply feel the pulse of the industry, engage in conversations with the people behind the products, and experience these remarkable machines on the roads they were designed for.
                </p>
                
                <div className="space-y-4">
                  <p className="leading-relaxed font-medium">
                    <strong className="text-link-blue">Mission:</strong><br/>
                    To bridge the critical gap between fragmented news and in-depth understanding. Machine translation can give you words, but it cannot provide you with insights.
                  </p>
                  
                  <p className="leading-relaxed font-medium italic">
                    <strong className="text-link-blue">Core Philosophy:</strong><br/>
                    "We don't just report the news; we connect the threads of facts."
                  </p>
                </div>
                
                <blockquote className="border-l-4 border-link-blue pl-6 italic text-text-secondary bg-gray-800/50 p-4 rounded-r-lg">
                  "In this rapidly evolving industry, information is value. My goal is to provide users with the most valuable Chinese EV intelligence, helping everyone find opportunities in this trillion-dollar market."
                </blockquote>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Social Links */}
            <div className="bg-dark-card rounded-xl shadow-lg p-6 h-fit">
              <h3 className="text-lg lg:text-xl font-bold text-text-main mb-6">Follow Me</h3>
              <div className="space-y-3">
                <a 
                  href="https://youtube.com/@VoltChina" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors group"
                >
                  <Youtube className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div className="flex-grow">
                    <div className="font-semibold text-text-main group-hover:text-red-600 text-sm lg:text-base">YouTube Channel</div>
                    <div className="text-xs lg:text-sm text-text-secondary">VoltChina</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </a>
                
                <a 
                  href="https://twitter.com/VoltChina" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors group"
                >
                  <Twitter className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="flex-grow">
                    <div className="font-semibold text-text-main group-hover:text-blue-600 text-sm lg:text-base">Twitter/X</div>
                    <div className="text-xs lg:text-sm text-text-secondary">@VoltChina</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </a>
                
                <a 
                  href="https://linkedin.com/in/leon-voltchina" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors group"
                >
                  <Linkedin className="w-5 h-5 text-blue-700 flex-shrink-0" />
                  <div className="flex-grow">
                    <div className="font-semibold text-text-main group-hover:text-blue-700 text-sm lg:text-base">LinkedIn</div>
                    <div className="text-xs lg:text-sm text-text-secondary">Leon VoltChina</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </a>
              </div>
            </div>
            

            
            {/* Contact */}
            <div className="bg-dark-card rounded-xl shadow-lg p-6 h-fit">
              <h3 className="text-lg lg:text-xl font-bold text-text-main mb-6">Contact & Collaboration</h3>
              <p className="text-text-secondary text-sm lg:text-base mb-6 leading-relaxed">
                For business partnerships, media interviews, or other inquiries, feel free to reach out:
              </p>
              <a 
                href="mailto:leon@voltchina.com" 
                className="inline-flex items-center gap-2 px-4 py-3 bg-cta-orange text-white rounded-lg hover:bg-cta-hover transition-colors font-medium text-sm lg:text-base w-full justify-center"
              >
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
                Send Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;