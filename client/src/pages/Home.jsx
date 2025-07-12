import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Users, 
  ThumbsUp, 
  CheckCircle, 
  Bell, 
  Menu, 
  X, 
  Edit3, 
  Tag, 
  Award, 
  Zap,
  ArrowRight,
  Star,
  TrendingUp,
  BookOpen,
  Globe,
  ChevronDown,
  Play,
  Sparkles
} from 'lucide-react';

const StackItLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '50px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    }, observerOptions);

    document.querySelectorAll('[id]').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const stats = [
    { number: '15K+', label: 'Questions Answered', color: 'from-blue-500 to-cyan-500' },
    { number: '8K+', label: 'Active Users', color: 'from-purple-500 to-pink-500' },
    { number: '95%', label: 'Answer Rate', color: 'from-green-500 to-emerald-500' },
    { number: '24/7', label: 'Community Support', color: 'from-orange-500 to-red-500' }
  ];

  const features = [
    {
      icon: Edit3,
      title: 'Rich Text Editor',
      description: 'Format your questions and answers with ease using our intuitive editor with markdown support.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Tag,
      title: 'Smart Tagging',
      description: 'Organize questions with relevant tags for better discoverability and structured knowledge.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: ThumbsUp,
      title: 'Community Voting',
      description: 'Upvote the best answers to help others find the most valuable solutions quickly.',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: CheckCircle,
      title: 'Accepted Answers',
      description: 'Mark the most helpful solution to close the loop and help future visitors.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Bell,
      title: 'Real-time Notifications',
      description: 'Stay updated on your questions and answers with instant notifications.',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Minimal, distraction-free interface designed for optimal user experience.',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const steps = [
    {
      icon: MessageCircle,
      title: 'Ask a Question',
      description: 'Share your question with our vibrant community of learners and experts.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Users,
      title: 'Get Community Answers',
      description: 'Receive thoughtful responses from knowledgeable community members.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Award,
      title: 'Vote & Accept',
      description: 'Help others by voting on answers and accepting the best solution.',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: BookOpen,
      title: 'Build Knowledge',
      description: 'Contribute to a growing repository of structured knowledge for everyone.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            top: '10%',
            left: '80%'
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-gradient-to-r from-pink-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
            top: '60%',
            left: '5%'
          }}
        />
      </div>

      {/* Navigation */}
     
      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center transition-all duration-1000 ${
            isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-blue-800 text-sm font-medium mb-8 shadow-lg border border-white/20">
              <Star className="w-4 h-4 mr-2 animate-pulse" />
              Trusted by 15K+ learners worldwide
              <Sparkles className="w-4 h-4 ml-2 text-yellow-500" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Ask. Learn.{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
                Share.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              A modern Q&A platform for collaborative learning and structured knowledge sharing. 
              Join our community of curious minds and expert contributors.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                <span className="relative z-10">Ask a Question</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              </button>
              <button className="group bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-full text-lg font-semibold border border-white/20 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                <span className="flex items-center">
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Browse Questions
                </span>
              </button>
            </div>

            {/* Animated Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className={`text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                    isVisible.hero ? 'animate-fade-in' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={`text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How StackIt Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of learners in a simple, four-step process that turns questions into knowledge.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`text-center group transition-all duration-700 ${
                  isVisible['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="relative mb-6">
                  <div className={`w-20 h-20 mx-auto bg-gradient-to-r ${step.color} rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-4 border-gray-100 flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-gray-700">{index + 1}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to ask better questions, provide better answers, and build better knowledge together.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group border border-white/20 hover:border-blue-200 ${
                  isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Trust */}
      <section id="community" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`mb-16 transition-all duration-1000 ${
            isVisible.community ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Learners Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join a thriving community of curious minds, expert contributors, and passionate learners.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: TrendingUp, title: 'Growing Fast', desc: 'Our community grows by 200+ members every week', color: 'from-blue-500 to-cyan-500' },
              { icon: Globe, title: 'Global Reach', desc: 'Users from 50+ countries sharing knowledge', color: 'from-green-500 to-emerald-500' },
              { icon: Award, title: 'High Quality', desc: '95% of questions receive helpful answers', color: 'from-purple-500 to-pink-500' }
            ].map((item, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${item.color} rounded-3xl p-8 text-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 ${
                  isVisible.community ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <item.icon className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="opacity-90">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Join StackIt?
              </h3>
              <p className="text-xl mb-8 opacity-90">
                Start asking questions, sharing knowledge, and learning from the community today.
              </p>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:bg-gray-50">
                Sign Up Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/95 backdrop-blur-sm text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">StackIt</span>
              </div>
              <p className="text-gray-400">
                Building knowledge together, one question at a time.
              </p>
            </div>
            {[
              { title: 'Platform', links: ['Browse Questions', 'Ask a Question', 'Tags', 'Users'] },
              { title: 'Company', links: ['About', 'Contact', 'Careers', 'Blog'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Guidelines'] }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2 text-gray-400">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="hover:text-white transition-colors duration-200">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 StackIt. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default StackItLanding;