import React, { useState } from 'react';
import {
  X,
  Sparkles,
  FileCheck,
  SlidersHorizontal,
  HelpCircle,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle,
  Copy,
  Plus
} from 'lucide-react';
import { Assessment, Subject, Rubric, AssessmentQuestion } from '../types';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  initialSubjectName?: string;
  initialTopic?: string;
  onAddGeneratedAssessment?: (assessment: Assessment) => void;
  onAddGeneratedRubric?: (rubric: Rubric) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  subjects,
  initialSubjectName = 'General Science',
  initialTopic = 'Cell Biology & Organelles',
  onAddGeneratedAssessment,
  onAddGeneratedRubric
}) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'rubric' | 'chat'>('quiz');

  // AI Quiz Generator Form State
  const [quizSubject, setQuizSubject] = useState(initialSubjectName);
  const [quizTopic, setQuizTopic] = useState(initialTopic);
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [generatedQuizResult, setGeneratedQuizResult] = useState<any>(null);

  // AI Rubric Generator Form State
  const [rubricSubject, setRubricSubject] = useState(initialSubjectName);
  const [rubricTopic, setRubricTopic] = useState(initialTopic);
  const [criteriaCount, setCriteriaCount] = useState(4);
  const [isLoadingRubric, setIsLoadingRubric] = useState(false);
  const [generatedRubricResult, setGeneratedRubricResult] = useState<Rubric | null>(null);

  // AI Free Assistant Chat State
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Hello! I am your Oakridge AI Assessment Assistant powered by Gemini. Ask me to write test questions, design rubric criteria, draft report card comments, or format syllabi.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  if (!isOpen) return null;

  // Handle Quiz Generation
  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingQuiz(true);
    setGeneratedQuizResult(null);

    try {
      const res = await fetch('/api/ai/generate-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectName: quizSubject,
          topic: quizTopic,
          questionCount,
          difficulty
        })
      });

      const data = await res.json();
      if (data.success && data.assessment) {
        setGeneratedQuizResult(data.assessment);
      }
    } catch (err) {
      console.error('Quiz generation error:', err);
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  // Handle Rubric Generation
  const handleGenerateRubric = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingRubric(true);
    setGeneratedRubricResult(null);

    try {
      const res = await fetch('/api/ai/generate-rubric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectName: rubricSubject,
          topic: rubricTopic,
          criteriaCount
        })
      });

      const data = await res.json();
      if (data.success && data.rubric) {
        setGeneratedRubricResult(data.rubric);
      }
    } catch (err) {
      console.error('Rubric generation error:', err);
    } finally {
      setIsLoadingRubric(false);
    }
  };

  // Handle Chat Submit
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: chatMessages
        })
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setChatMessages(prev => [...prev, { role: 'model', text: data.reply }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border-2 border-stone-900 rounded-none w-full max-w-3xl max-h-[92vh] flex flex-col shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] my-auto overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#1C1917] text-stone-50 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="font-serif font-bold text-base text-white">Gemini AI Assessment Assistant</h3>
          </div>

          <button onClick={onClose} className="p-1 rounded text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-300 bg-[#FAF8F5]">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2.5 text-xs font-serif font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'quiz'
                ? 'border-purple-900 text-purple-900 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileCheck className="w-4 h-4 text-purple-900" />
            <span>AI Quiz Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('rubric')}
            className={`px-4 py-2.5 text-xs font-serif font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'rubric'
                ? 'border-purple-900 text-purple-900 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-purple-900" />
            <span>AI Rubric Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2.5 text-xs font-serif font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'chat'
                ? 'border-purple-900 text-purple-900 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-purple-900" />
            <span>Teaching Co-Pilot Chat</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-900">
          {/* TAB 1: Quiz Generator */}
          {activeTab === 'quiz' && (
            <div className="space-y-5">
              <form onSubmit={handleGenerateQuiz} className="p-4 bg-purple-50 border border-purple-900 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-800">Subject Department</label>
                    <input
                      type="text"
                      value={quizSubject}
                      onChange={e => setQuizSubject(e.target.value)}
                      placeholder="e.g. Organic Chemistry"
                      className="w-full px-3 py-1.5 bg-white border border-stone-800 text-xs font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-800">Topic / Focus Unit</label>
                    <input
                      type="text"
                      value={quizTopic}
                      onChange={e => setQuizTopic(e.target.value)}
                      placeholder="e.g. Functional Groups & IUPAC Naming"
                      className="w-full px-3 py-1.5 bg-white border border-stone-800 text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-800">Question Count</label>
                    <select
                      value={questionCount}
                      onChange={e => setQuestionCount(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-stone-800 text-xs"
                    >
                      <option value={3}>3 Questions</option>
                      <option value={5}>5 Questions</option>
                      <option value={8}>8 Questions</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-800">Cognitive Rigor / Level</label>
                    <select
                      value={difficulty}
                      onChange={e => setDifficulty(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-800 text-xs"
                    >
                      <option value="Introductory">Introductory</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced / AP Level">Advanced / AP Level</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoadingQuiz}
                  className="w-full py-2 bg-purple-900 hover:bg-purple-950 text-purple-100 font-bold text-xs border border-purple-950 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  {isLoadingQuiz ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                      <span>Synthesizing Test Items with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-purple-300" />
                      <span>Generate Quiz Blueprint</span>
                    </>
                  )}
                </button>
              </form>

              {/* Quiz Results View */}
              {generatedQuizResult && (
                <div className="editorial-card p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <div>
                      <h4 className="text-base font-serif font-bold text-stone-900">{generatedQuizResult.title}</h4>
                      <p className="text-xs text-stone-600 font-mono">Code: {generatedQuizResult.code} • Total: {generatedQuizResult.totalPoints} pts</p>
                    </div>

                    {onAddGeneratedAssessment && (
                      <button
                        onClick={() => {
                          onAddGeneratedAssessment(generatedQuizResult);
                          onClose();
                        }}
                        className="px-4 py-2 bg-stone-900 text-stone-50 text-xs font-bold border border-stone-900 flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Assessment Directory</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {generatedQuizResult.questions?.map((q: AssessmentQuestion, idx: number) => (
                      <div key={q.id || idx} className="p-3 bg-[#FAF8F5] border border-stone-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold font-serif text-purple-900">Item #{idx + 1} ({q.points} pts)</span>
                          <span className="text-[10px] font-mono font-bold uppercase bg-stone-200 border border-stone-400 px-1.5 py-0.5 text-stone-800">
                            {q.questionType}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-stone-900">{q.text}</p>
                        {q.sampleAnswer && (
                          <p className="text-[11px] text-stone-600 italic bg-white p-2 border border-stone-300">
                            Answer Key: {q.sampleAnswer}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Rubric Generator */}
          {activeTab === 'rubric' && (
            <div className="space-y-5">
              <form onSubmit={handleGenerateRubric} className="p-4 bg-purple-50 border border-purple-900 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-800">Subject Department</label>
                    <input
                      type="text"
                      value={rubricSubject}
                      onChange={e => setRubricSubject(e.target.value)}
                      placeholder="e.g. World History"
                      className="w-full px-3 py-1.5 bg-white border border-stone-800 text-xs font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-800">Project / Essay Topic</label>
                    <input
                      type="text"
                      value={rubricTopic}
                      onChange={e => setRubricTopic(e.target.value)}
                      placeholder="e.g. Comparative Analysis of Industrial Revolutions"
                      className="w-full px-3 py-1.5 bg-white border border-stone-800 text-xs font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoadingRubric}
                  className="w-full py-2 bg-purple-900 hover:bg-purple-950 text-purple-100 font-bold text-xs border border-purple-950 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  {isLoadingRubric ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                      <span>Synthesizing Rubric Criteria Matrix...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-purple-300" />
                      <span>Architect Evaluation Rubric</span>
                    </>
                  )}
                </button>
              </form>

              {/* Rubric Result View */}
              {generatedRubricResult && (
                <div className="editorial-card p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <div>
                      <h4 className="text-base font-serif font-bold text-stone-900">{generatedRubricResult.title}</h4>
                      <p className="text-xs text-stone-600">{generatedRubricResult.description}</p>
                    </div>

                    {onAddGeneratedRubric && (
                      <button
                        onClick={() => {
                          onAddGeneratedRubric(generatedRubricResult);
                          onClose();
                        }}
                        className="px-4 py-2 bg-stone-900 text-stone-50 text-xs font-bold border border-stone-900 flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Save to Rubric Library</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {generatedRubricResult.criteria?.map((crit, idx) => (
                      <div key={crit.id || idx} className="p-3 bg-[#FAF8F5] border border-stone-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-serif font-bold text-stone-900">{idx + 1}. {crit.title}</span>
                          <span className="text-[10px] font-mono font-bold text-purple-900">Weight: {crit.weight}%</span>
                        </div>
                        <p className="text-xs text-stone-600">{crit.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Teaching Co-Pilot Chat */}
          {activeTab === 'chat' && (
            <div className="space-y-4 flex flex-col h-[420px]">
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 text-xs leading-relaxed max-w-[85%] ${
                      msg.role === 'user'
                        ? 'ml-auto bg-stone-900 text-stone-50 border border-stone-900'
                        : 'mr-auto bg-[#FAF8F5] text-stone-900 border border-stone-800 font-sans'
                    }`}
                  >
                    <span className="text-[10px] font-bold tracking-widest block uppercase opacity-60 mb-1 font-mono">
                      {msg.role === 'user' ? 'Educator Prompt' : 'Oakridge AI Co-Pilot'}
                    </span>
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChatMessage} className="flex space-x-2 pt-2 border-t border-stone-300">
                <input
                  type="text"
                  placeholder="Ask Gemini to draft comments, format questions, or explain rubrics..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-stone-800 text-xs text-stone-900 placeholder-stone-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isChatLoading || !chatInput.trim()}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-bold border border-stone-900 flex items-center space-x-1 disabled:opacity-50"
                >
                  {isChatLoading ? <Loader2 className="w-4 h-4 animate-spin text-stone-300" /> : <Send className="w-4 h-4" />}
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
