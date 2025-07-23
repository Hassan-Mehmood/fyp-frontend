// app/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Bot,
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  Mail,
  Github,
  Chrome,
  Star,
  Users,
  MessageCircle,
  Cpu,
  Globe,
  Lock,
  Rocket,
  Heart,
  CheckCircle
} from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar: string;
}

const RootPage = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTestimonial, setCurrentTestimonial] = useState<number>(0);
  
  // Redirect to home if authenticated
  useEffect(() => {
    if (isLoaded) {
      setIsLoading(false);
      if (isSignedIn) {
        router.push("/home");
      }
    }
  }, [isSignedIn, isLoaded, router]);

  
  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg animate-pulse">
            <span className="text-white font-bold text-2xl">N</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
        </div>
      </div>
    );
  }
  
  // If user is authenticated, they'll be redirected, so we can return null
  if (isSignedIn) {
    return null;
  }
  
  // Beautiful login page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left side - Hero content */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
                <h1 className="text-3xl font-bold">Instant Bots</h1>
              </div>
              
              <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
                Your AI
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {" "}Companion
                </span>
                <br />
                Awaits
              </h2>
              
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                Discover the future of AI interaction. Chat with intelligent characters, 
                create custom bots, and unlock limitless possibilities.
              </p>
            </div>
            
            {/* Features grid */}
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="flex items-center space-x-2 text-gray-300">
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-sm">Intelligent AI</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-sm">Custom Bots</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-sm">Instant Response</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-sm">Secure Platform</span>
              </div>
            </div>
          </div>
          
          {/* Right side - Login form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Get Started</h3>
                <p className="text-gray-300">Join thousands of users already using AI</p>
              </div>
              
              {/* Login buttons */}
              <div className="space-y-4">
                <div className="grid">
                  <SignInButton mode="modal">
                    <button className="w-full bg-white/10 border border-white/20 text-white py-3 px-4 rounded-xl font-medium hover:bg-white/20 transition-all duration-200 flex items-center justify-center space-x-2">
                      <Chrome size={16} />
                      <span className="text-sm">Google</span>
                    </button>
                  </SignInButton>
                </div>
              </div>
              
              {/* Features preview */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Smart AI Characters</p>
                    <p className="text-xs text-gray-400">Engage with unique personalities</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Custom Bot Builder</p>
                    <p className="text-xs text-gray-400">Create your perfect AI assistant</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Lightning Fast</p>
                    <p className="text-xs text-gray-400">Instant AI responses every time</p>
                  </div>
                </div>
              </div>
              
              {/* Security badge */}
              <div className="flex items-center justify-center space-x-2 text-gray-400 text-xs mt-6 pt-6 border-t border-white/10">
                <Shield size={12} />
                <span>Secured by Clerk Authentication</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom section with additional info */}
      <div className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <h4 className="text-white font-semibold">Join the Community</h4>
              <p className="text-gray-400 text-sm">Connect with AI enthusiasts worldwide</p>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                <MessageCircle size={20} className="text-white" />
              </div>
              <h4 className="text-white font-semibold">24/7 Support</h4>
              <p className="text-gray-400 text-sm">Get help whenever you need it</p>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Heart size={20} className="text-white" />
              </div>
              <h4 className="text-white font-semibold">Free to Start</h4>
              <p className="text-gray-400 text-sm">Begin your AI journey at no cost</p>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default RootPage;