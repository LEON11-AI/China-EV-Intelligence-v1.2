import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface NewsletterSubscriptionProps {
  variant?: 'hero' | 'sidebar' | 'footer';
  className?: string;
  greetingStyle?: 'formal' | 'casual' | 'chinese';
}

const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({ 
  variant = 'hero', 
  className,
  greetingStyle = 'formal'
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const getGreeting = (name: string, style: string) => {
    const trimmedName = name.trim();
    switch (style) {
      case 'formal':
        return `Dear ${trimmedName}`;
      case 'casual':
        return `Hi ${trimmedName}`;
      case 'chinese':
        return `尊敬的${trimmedName}`;
      default:
        return `Dear ${trimmedName}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    if (!name || name.trim().length < 2) {
      setStatus('error');
      setMessage('Please enter your name');
      return;
    }

    setStatus('loading');
    
    try {
      // EmailJS configuration from environment variables
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      // Check if EmailJS is properly configured
      if (!serviceId || !templateId || !publicKey) {
        console.error('EmailJS configuration missing:', { serviceId: !!serviceId, templateId: !!templateId, publicKey: !!publicKey });
        setStatus('error');
        setMessage('Email service is not configured. Please contact the administrator.');
        return;
      }

      // Check for placeholder values
      if (serviceId.includes('xxxxxxx') || templateId.includes('xxxxxxx') || publicKey.includes('xxxxxxx')) {
        console.error('EmailJS configuration contains placeholder values');
        setStatus('error');
        setMessage('Email service is not properly configured. Please contact the administrator.');
        return;
      }

      const templateParams = {
        to_email: email,
        to_name: getGreeting(name, greetingStyle), // 使用可配置的称呼格式
        from_name: 'China EV Intelligence',
        message: 'Thank you for subscribing to our newsletter! You will receive the latest insights about China\'s electric vehicle industry.',
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      setStatus('success');
      setMessage('Thank you for subscribing! Check your email for confirmation.');
      setEmail('');
      setName('');
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch (error) {
      console.error('EmailJS error:', error);
      setStatus('error');
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Invalid template ID')) {
          setMessage('Email template not found. Please contact the administrator.');
        } else if (error.message.includes('Invalid service ID')) {
          setMessage('Email service not configured. Please contact the administrator.');
        } else if (error.message.includes('Invalid public key')) {
          setMessage('Email service authentication failed. Please contact the administrator.');
        } else {
          setMessage('Failed to send subscription request. Please try again later.');
        }
      } else {
        setMessage('Something went wrong. Please try again later.');
      }
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'hero':
        return {
          container: 'bg-gradient-to-r from-cta-orange to-cta-hover p-8 rounded-2xl shadow-xl',
          title: 'text-3xl font-bold text-white mb-4',
          description: 'text-white/90 mb-6 text-lg',
          form: 'flex flex-col gap-4',
          input: 'px-4 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none',
          button: 'px-6 py-3 bg-white text-cta-orange font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center gap-2'
        };
      case 'sidebar':
        return {
          container: 'bg-dark-card p-6 rounded-lg shadow-lg border border-gray-700',
          title: 'text-xl font-bold text-text-main mb-3',
          description: 'text-text-secondary mb-4 text-sm',
          form: 'space-y-3',
          input: 'w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-md text-text-main placeholder-text-secondary focus:ring-2 focus:ring-cta-orange focus:border-transparent focus:outline-none',
          button: 'w-full px-4 py-2 bg-cta-orange text-white font-medium rounded-md hover:bg-cta-hover transition-colors duration-300 flex items-center justify-center gap-2'
        };
      case 'footer':
        return {
          container: 'bg-dark-card/50 p-6 rounded-lg',
          title: 'text-lg font-semibold text-text-main mb-3',
          description: 'text-text-secondary mb-4 text-sm',
          form: 'flex flex-col gap-3',
          input: 'px-3 py-2 bg-dark-bg border border-gray-600 rounded-md text-text-main placeholder-text-secondary focus:ring-2 focus:ring-cta-orange focus:border-transparent focus:outline-none',
          button: 'px-4 py-2 bg-cta-orange text-white font-medium rounded-md hover:bg-cta-hover transition-colors duration-300 flex items-center justify-center gap-1'
        };
      default:
        return getVariantStyles();
    }
  };

  const styles = getVariantStyles();

  const renderStatusMessage = () => {
    if (!message) return null;

    return (
      <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
        status === 'success' 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        {status === 'success' ? (
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
        )}
        <span className="text-sm">{message}</span>
      </div>
    );
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className="text-center">
        <h3 className={styles.title}>
          Stay Updated with China EV Intelligence
        </h3>
        <p className={styles.description}>
          Get exclusive insights, market analysis, and the latest developments in China's EV industry delivered to your inbox.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className={styles.input}
          disabled={status === 'loading'}
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className={styles.input}
          disabled={status === 'loading'}
          required
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`${styles.button} ${status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {status === 'loading' ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Subscribing...
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              Subscribe
            </>
          )}
        </button>
      </form>
      
      {renderStatusMessage()}
      
      {variant === 'hero' && (
        <p className="text-white/70 text-sm mt-4 text-center">
          Join 1,000+ industry professionals. Unsubscribe anytime.
        </p>
      )}
    </div>
  );
};

export default NewsletterSubscription;