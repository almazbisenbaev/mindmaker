'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Send, Sparkles, MessageSquare, Lightbulb, Target, TrendingUp, Users, ShieldCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DebugInfo from './debug-info';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [initialIdea, setInitialIdea] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Debug logging on component mount
  useEffect(() => {
    console.log('🚀 Mindmaker - Component mounted');
    console.log('🌍 Environment:', process.env.NODE_ENV);
    console.log('📝 Note: Client-side cannot access server environment variables');
    console.log('🔍 Check debug overlay (bottom-right) for server API key status');
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStartConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialIdea.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: initialIdea.trim(),
    };

    setMessages([userMessage]);
    setConversationStarted(true);
    setIsLoading(true);

    try {
      console.log('🌐 Sending initial request to API');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [userMessage],
        }),
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API request failed:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.text();
      console.log('📝 Received response:', result);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result,
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('💥 Error in handleStartConversation:', error);
      
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage,
      }]);
    } finally {
      setIsLoading(false);
      console.log('🏁 Initial request completed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    console.log('� Submitting message:', input.trim());

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      console.log('🌐 Sending request to API');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API request failed:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.text();
      console.log('📝 Received response:', result);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result,
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('💥 Error in handleSubmit:', error);
      
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage,
      }]);
    } finally {
      setIsLoading(false);
      console.log('🏁 Request handling completed');
    }
  };

  if (!conversationStarted) {
    return (
      <div className="flex flex-col min-h-screen bg-background selection:bg-primary/30 selection:text-primary relative overflow-hidden">
        <div className="mesh-gradient" />
        
        <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 relative z-10">
          <div className="w-full max-w-5xl space-y-24">
            <div className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2 border border-primary/20 bg-primary/5 backdrop-blur-xl text-xs font-bold uppercase tracking-[0.3em] rounded-full shadow-[0_0_20px_rgba(99,102,241,0.1)] text-primary animate-in fade-in slide-in-from-top-4 duration-1000">
                <Sparkles className="w-4 h-4" />
                <span>Mindmaker AI Strategy Engine</span>
              </div>
              
              <div className="space-y-6">
                <h1 className="text-8xl md:text-9xl font-black tracking-tight leading-[0.8] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500">
                    MIND<br />
                  </span>
                  <span className="text-primary italic">MAKER</span>
                </h1>
                <p className="text-xl md:text-3xl font-medium max-w-3xl text-zinc-500 leading-relaxed mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                  Elevate your business vision with <span className="text-zinc-900 dark:text-white font-bold underline decoration-primary/30 decoration-4 underline-offset-4">architectural precision</span> and data-driven intelligence.
                </p>
              </div>
            </div>
            
            <div className="animate-in fade-in zoom-in duration-1000 delay-700">
              <Card className="border-white/40 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] group">
                <CardContent className="p-3 md:p-4">
                  <form onSubmit={handleStartConversation} className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Input
                        type="text"
                        value={initialIdea}
                        onChange={(e) => setInitialIdea(e.target.value)}
                        placeholder="Define your vision..."
                        className="h-24 text-2xl font-semibold border-none focus:ring-0 shadow-none bg-transparent placeholder:text-zinc-300"
                        disabled={isLoading}
                      />
                      <div className="absolute right-8 top-1/2 -translate-y-1/2">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200/50 dark:border-zinc-700/50 group-focus-within:border-primary/50 transition-colors">
                          <Lightbulb className="w-6 h-6 text-zinc-400 group-focus-within:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isLoading || !initialIdea.trim()}
                      className="h-24 md:h-auto px-16 text-xl font-black rounded-2xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] bg-primary hover:bg-primary/90 text-white"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-4">
                          <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>SYNTHESIZING</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          GENERATE STRATEGY
                          <ArrowRight className="w-7 h-7 transition-transform group-hover:translate-x-2" />
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-1000">
              {[
                { icon: Target, title: 'Precision Fit', desc: 'Identify your exact market niche and demand signals.', color: 'text-blue-500' },
                { icon: TrendingUp, title: 'Scalable Growth', desc: 'Sustainable frameworks for exponential expansion.', color: 'text-indigo-500' },
                { icon: Users, title: 'Network Edge', desc: 'Construct moats through strategic differentiation.', color: 'text-violet-500' }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-3xl border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-500 backdrop-blur-sm">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center border border-border group-hover:scale-110 transition-all duration-500 bg-white dark:bg-zinc-900 shadow-sm", feature.color)}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <div className="mt-8 space-y-3">
                    <h3 className="text-2xl font-bold tracking-tight">{feature.title}</h3>
                    <p className="text-zinc-500 font-medium leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        
        <footer className="p-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-400 bg-background/50 backdrop-blur-xl z-20 relative">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white dark:text-zinc-900" />
            </div>
            <span className="text-sm font-black uppercase tracking-[0.4em]">Mindmaker v2.4</span>
          </div>
          <div className="flex gap-12 text-xs font-bold uppercase tracking-[0.4em]">
            {['Twitter', 'Github', 'Discord'].map(link => (
              <span key={link} className="cursor-pointer hover:text-primary transition-colors hover:scale-110 duration-300">{link}</span>
            ))}
          </div>
        </footer>
        <DebugInfo />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background selection:bg-primary/30 selection:text-primary relative overflow-hidden">
      <div className="mesh-gradient" />
      
      <header className="border-b border-white/10 px-6 py-3 flex justify-between items-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-2xl z-20 relative">
        <div className="flex items-center gap-4">
          <div className="bg-primary text-white p-2 rounded-xl">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight uppercase">Strategy Session</h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">Intelligence Active</p>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="rounded-full px-6 font-black text-[9px] tracking-[0.15em] border-zinc-200/50 dark:border-zinc-700/50 hover:bg-primary hover:text-white hover:border-primary transition-all duration-500">
            TERMINATE SESSION
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col md:flex-row relative z-10">
        {/* Modern Sidebar */}
        <aside className="hidden lg:flex w-72 border-r border-white/10 flex-col p-6 space-y-8 overflow-y-auto bg-white/30 dark:bg-zinc-900/30 backdrop-blur-md">
          <div className="space-y-6">
            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 px-1">Diagnostic Data</h3>
            <div className="space-y-4">
              {[
                { label: 'Market Viability', value: '84%', width: 'w-[84%]', color: 'bg-blue-500' },
                { label: 'Structural Integrity', value: '92%', width: 'w-[92%]', color: 'bg-indigo-500' },
                { label: 'Capital Efficiency', value: '76%', width: 'w-[76%]', color: 'bg-violet-500' }
              ].map((metric) => (
                <div key={metric.label} className="space-y-2 p-3 rounded-xl bg-white/50 dark:bg-zinc-800/50 border border-white/10">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-zinc-500">{metric.label}</span>
                    <span className="text-primary">{metric.value}</span>
                  </div>
                  <div className="w-full bg-zinc-200/50 dark:bg-zinc-700/50 h-1 rounded-full overflow-hidden">
                    <div className={cn("h-full transition-all duration-[2000ms] ease-out", metric.color, metric.width)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col h-full relative">
          <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message: Message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                >
                  <div
                    className={cn(
                      "max-w-[85%] md:max-w-[80%] p-4 md:p-5 transition-all relative group",
                      message.role === 'user'
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl rounded-tr-none ml-12'
                        : 'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 text-zinc-900 dark:text-white rounded-2xl rounded-tl-none mr-12'
                    )}
                  >
                    <div className={cn(
                      "text-[9px] font-black uppercase tracking-[0.3em] mb-3 flex items-center gap-2",
                      message.role === 'user' ? 'text-zinc-400' : 'text-primary'
                    )}>
                      <div className={cn("w-1 h-1 rounded-full", message.role === 'user' ? 'bg-zinc-400' : 'bg-primary')} />
                      {message.role === 'user' ? 'Visionary' : 'Strategist'}
                    </div>
                    <div className="text-sm md:text-base font-medium leading-relaxed prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:tracking-tighter prose-headings:uppercase prose-headings:font-black">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({node, ...props}) => <h1 className="text-xl font-black tracking-tighter uppercase mb-4 mt-6 text-primary" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-lg font-black tracking-tighter uppercase mb-3 mt-5 border-l-4 border-primary/30 pl-3" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-base font-bold tracking-tight uppercase mb-2 mt-4" {...props} />,
                          p: ({node, ...props}) => <p className="mb-4 last:mb-0 text-zinc-600 dark:text-zinc-300" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-none pl-0 mb-4 space-y-2" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2 font-bold" {...props} />,
                          li: ({node, ...props}) => (
                            <li className="flex gap-3 items-start">
                              <div className="mt-1.5 w-1 h-1 rounded-full bg-primary/50 shrink-0" />
                              <span className="font-medium text-zinc-600 dark:text-zinc-300">{props.children}</span>
                            </li>
                          ),
                          strong: ({node, ...props}) => <strong className="font-black text-zinc-900 dark:text-white" {...props} />,
                          code: ({node, ...props}) => (
                            <code className="bg-primary/5 text-primary px-1.5 py-0.5 rounded-lg text-xs font-mono border border-primary/10" {...props} />
                          ),
                          blockquote: ({node, ...props}) => (
                            <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-lg font-light text-zinc-500" {...props} />
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 p-5 rounded-2xl rounded-tl-none mr-12">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <div className="p-4 md:p-6 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-3xl border-t border-white/10 relative z-20">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-4">
              <div className="flex-1 relative group">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Evolve your strategy..."
                  className="h-12 text-sm font-semibold border-white/20 focus:border-primary/50 transition-all duration-500 pr-16 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl rounded-xl"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500",
                    input.trim() ? "bg-primary text-white" : "bg-zinc-100 dark:bg-zinc-700 text-zinc-300"
                  )}>
                    <Send className={cn("w-4 h-4", input.trim() && "animate-pulse")} />
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-12 px-8 rounded-xl font-black text-[10px] tracking-[0.2em] hidden md:flex bg-primary hover:bg-primary/90 text-white active:scale-95 transition-all duration-500"
              >
                EXECUTE
              </Button>
            </form>
          </div>
        </div>
      </main>
      
      <DebugInfo />
    </div>
  );
}
