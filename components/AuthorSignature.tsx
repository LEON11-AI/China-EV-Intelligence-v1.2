import React from 'react';
import { MapPin, ExternalLink, Youtube, Twitter, Linkedin } from 'lucide-react';

interface AuthorSignatureProps {
  className?: string;
}

const AuthorSignature: React.FC<AuthorSignatureProps> = ({ className = '' }) => {
  return (
    <div className={`bg-dark-card rounded-xl p-6 mt-8 shadow-lg ${className}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        {/* Author Avatar */}
        <div className="flex-shrink-0">
          <div className="relative">
            <img 
              src="/images/leon.jpg" 
              alt="Leon - Founder of VoltChina" 
              className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
              <MapPin className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
        
        {/* Author Info */}
        <div className="flex-grow">
          <div className="mb-2">
            <h4 className="text-lg font-bold text-text-main">Leon</h4>
        <p className="text-text-secondary font-medium">Founder of VoltChina, reporting from Guangzhou</p>
          </div>
          
          <div className="text-text-secondary text-sm leading-relaxed mb-3">
            <p>
              Focused on in-depth analysis and market insights of China's new energy vehicle industry.
            </p>
          </div>
          
          {/* Social Links */}
          <div className="flex flex-wrap gap-3">
            <a 
              href="https://youtube.com/@VoltChina" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-colors group"
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>YouTube</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            
            <a 
              href="https://twitter.com/VoltChina" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-400 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors group"
            >
              <Twitter className="w-3.5 h-3.5" />
              <span>Twitter</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            
            <a 
              href="https://linkedin.com/in/leon-voltchina" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-400 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors group"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>
        
        {/* CTA */}
        <div className="flex-shrink-0">
          <a 
              href="/about" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-slate-600 rounded-lg text-sm font-medium transition-colors"
            >
            <span>Learn More</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
      
      {/* Divider */}
      <div className="mt-4 pt-4 border-t border-gray-600">
      <p className="text-xs text-text-secondary text-center">💡 <strong>Professional Insights:</strong> Subscribe to PRO for exclusive analysis and first-hand market intelligence</p>
      </div>
    </div>
  );
};

export default AuthorSignature;