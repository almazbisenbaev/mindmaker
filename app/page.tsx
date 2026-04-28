'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, RotateCcw, Loader2, ChevronRight } from 'lucide-react';
import { SwotAnalysis } from '@/components/swot-analysis';
import { LeanCanvas, LeanCanvasData } from '@/components/lean-canvas';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface ReviewData {
  review: string;
  tips: string[];
  nextSteps: string[];
}

interface AnalysisData {
  review: ReviewData;
  swot: SwotData;
  leanCanvas: LeanCanvasData;
}

type Phase = 'intro' | 'chat' | 'analyzing' | 'results';

const USER_MESSAGE_THRESHOLD = 3;

export default function Home() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [initialIdea, setInitialIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [analyzingSteps, setAnalyzingSteps] = useState({ review: false, swot: false, leanCanvas: false });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const userMessageCount = messages.filter(m => m.role === 'user').length;

  async function sendMessage(msgs: Message[]) {
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.message,
      };
      const updatedMessages = [...msgs, assistantMessage];
      setMessages(updatedMessages);
      if (data.isComplete) {
        await runAnalysis(updatedMessages);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  async function runAnalysis(msgs: Message[]) {
    setPhase('analyzing');
    setAnalyzingSteps({ review: false, swot: false, leanCanvas: false });

    const body = JSON.stringify({ messages: msgs });
    const headers = { 'Content-Type': 'application/json' };

    try {
      const [reviewRes, swotRes, leanCanvasRes] = await Promise.all([
        fetch('/api/analyze/review', { method: 'POST', headers, body }).then(r => {
          setAnalyzingSteps(s => ({ ...s, review: true }));
          return r.json();
        }),
        fetch('/api/analyze/swot', { method: 'POST', headers, body }).then(r => {
          setAnalyzingSteps(s => ({ ...s, swot: true }));
          return r.json();
        }),
        fetch('/api/analyze/lean-canvas', { method: 'POST', headers, body }).then(r => {
          setAnalyzingSteps(s => ({ ...s, leanCanvas: true }));
          return r.json();
        }),
      ]);

      setAnalysisData({ review: reviewRes, swot: swotRes, leanCanvas: leanCanvasRes });
      setPhase('results');
    } catch (err) {
      console.error('Analysis failed:', err);
      setPhase('chat');
    }
  }

  async function handleStart(e: React.FormEvent) {
    e.preventDefault();
    if (!initialIdea.trim() || isLoading) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: initialIdea.trim(),
    };
    setMessages([userMessage]);
    setPhase('chat');
    await sendMessage([userMessage]);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput('');
    await sendMessage(updated);
  }

  function handleReset() {
    setPhase('intro');
    setMessages([]);
    setInput('');
    setInitialIdea('');
    setAnalysisData(null);
  }

  // ─── Intro ───────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Mindmaker</h1>
            <p className="text-muted-foreground mt-1">
              Describe your business idea and we&apos;ll help you validate it through a conversation.
            </p>
          </div>
          <form onSubmit={handleStart} className="space-y-3">
            <Textarea
              value={initialIdea}
              onChange={e => setInitialIdea(e.target.value)}
              placeholder="E.g. An app that connects local farmers with urban consumers for weekly produce boxes..."
              className="min-h-32"
              disabled={isLoading}
            />
            <Button type="submit" disabled={!initialIdea.trim() || isLoading} className="w-full">
              {isLoading ? (
                <><Loader2 className="animate-spin" /> Starting...</>
              ) : (
                <>Start Conversation <ChevronRight /></>
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Analyzing ───────────────────────────────────────────────────────────
  if (phase === 'analyzing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
          <div>
            <h2 className="text-lg font-semibold">Generating your analysis</h2>
            <p className="text-sm text-muted-foreground mt-1">This may take a moment...</p>
          </div>
          <div className="text-left space-y-2">
            {[
              { key: 'review' as const, label: 'Review & tips' },
              { key: 'swot' as const, label: 'SWOT analysis' },
              { key: 'leanCanvas' as const, label: 'Lean Canvas' },
            ].map(step => (
              <div key={step.key} className="flex items-center gap-3 text-sm">
                {analyzingSteps[step.key] ? (
                  <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</span>
                ) : (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                )}
                <span className={analyzingSteps[step.key] ? 'text-foreground' : 'text-muted-foreground'}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Results ─────────────────────────────────────────────────────────────
  if (phase === 'results' && analysisData) {
    const { review, swot, leanCanvas } = analysisData;
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Your Analysis</h1>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw /> Start Over
            </Button>
          </div>

          {/* Review */}
          <Card>
            <CardHeader>
              <CardTitle>Review</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{review.review}</p>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Tips & Advice</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {review.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="font-semibold text-muted-foreground shrink-0">{i + 1}.</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {review.nextSteps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <ChevronRight className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* SWOT */}
          <Card>
            <CardHeader>
              <CardTitle>SWOT Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <SwotAnalysis data={swot} />
            </CardContent>
          </Card>

          {/* Lean Canvas */}
          <Card>
            <CardHeader>
              <CardTitle>Lean Canvas</CardTitle>
            </CardHeader>
            <CardContent>
              <LeanCanvas data={leanCanvas} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ─── Chat ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b px-4 py-3 flex items-center justify-between shrink-0">
        <h1 className="font-semibold">Mindmaker</h1>
        <div className="flex items-center gap-2">
          {userMessageCount >= USER_MESSAGE_THRESHOLD && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => runAnalysis(messages)}
              disabled={isLoading}
            >
              Generate Analysis
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={handleReset}>
            <RotateCcw />
          </Button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="border-t p-4 shrink-0">
        <form onSubmit={handleSend} className="max-w-2xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your answer..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
            <Send />
          </Button>
        </form>
      </footer>
    </div>
  );
}
