import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient";
import CosmicBackground from './CosmicBackground';
import { motion, AnimatePresence } from 'framer-motion';
import SubmissionHistory from '../components/SubmissonHistory';
import ChatAi from '../components/ChatAi';
import Editorial from "../components/Editorial";

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const [editorHeight, setEditorHeight] = useState('60vh');
  const editorRef = useRef(null);
  let { problemId } = useParams();

  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        
        const initialCode = response.data.startCode.find((sc) => {
          if (sc.language === "C++" && selectedLanguage === 'cpp') return true;
          if (sc.language === "Java" && selectedLanguage === 'java') return true;
          if (sc.language === "Javascript" && selectedLanguage === 'javascript') return true;
          return false;
        })?.initialCode || '// Write your solution here';
        
        setProblem(response.data);
        setCode(initialCode);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => 
        (sc.language === "C++" && selectedLanguage === 'cpp') ||
        (sc.language === "Java" && selectedLanguage === 'java') ||
        (sc.language === "Javascript" && selectedLanguage === 'javascript')
      )?.initialCode || '// Write your solution here';
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });

      setRunResult(response.data);
      setLoading(false);
      setActiveRightTab('testcase');
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error'
      });
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code: code,
        language: selectedLanguage
      });

      setSubmitResult(response.data);
      setLoading(false);
      setActiveRightTab('result');
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult(null);
      setLoading(false);
      setActiveRightTab('result');
    }
  };

  const getLanguageForMonaco = (lang) => { 
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'hard': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Error': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'Running': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <div className="w-32 h-32 border-t-4 border-b-4 border-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin reverse"></div>
          </div>
        </motion.div> 
      </div>
    );
  }

  return (
    <CosmicBackground>
      <div className=" w-full h-full flex flex-col lg:flex-row bg-transparent p-4 gap-4">
        {/* Left Panel */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:w-1/2 flex flex-col bg-base-100/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden"
        >
          {/* Left Tabs */}
          <div className="flex border-b border-white/10 bg-base-200/20 backdrop-blur-sm px-4">
            {['description', 'editorial', 'solutions', 'submissions','chatAi'].map((tab) => (
              <button
                key={tab}
                className={`relative px-4 py-3 font-medium text-sm transition-all duration-300 ${
                  activeLeftTab === tab 
                    ? 'text-indigo-400' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                onClick={() => setActiveLeftTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeLeftTab === tab && (
                  <motion.div 
                    layoutId="leftTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Left Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {problem && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLeftTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeLeftTab === 'description' && (
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-6">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                          {problem.title}
                        </h1>
                        <div className={`px-3 py-1 rounded-full border ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                        </div>
                        <div className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                          {problem.tags}
                        </div>
                      </div>

                      <div className="prose max-w-none text-gray-300">
                        <div className="whitespace-pre-wrap text-base leading-relaxed">
                          {problem.description}
                        </div>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4 text-gray-200">Examples:</h3>
                        <div className="space-y-4">
                          {problem.visibleTestCases.map((example, index) => (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-base-200/30 backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-lg"
                            >
                              <h4 className="font-semibold mb-2 text-black">Example {index + 1}:</h4>
                              <div className="space-y-2 text-sm font-mono">
                                <div><strong className="text-gray-900">Input:</strong> <span className="text-gray-900">{example.input}</span></div>
                                <div><strong className="text-gray-900">Output:</strong> <span className="text-emerald-900">{example.output}</span></div>
                                <div><strong className="text-gray-900">Explanation:</strong> <span className="text-gray-900">{example.explanation}</span></div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeLeftTab === 'editorial' && (
                    <div className="prose max-w-none">
                      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Editorial</h2>
                      <Editorial></Editorial>
                      
                    </div>
                  )}

                  {activeLeftTab === 'solutions' && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Solutions</h2>
                      <div className="space-y-6">
                        {problem.referenceSolution?.map((solution, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border border-white/10 rounded-xl overflow-hidden shadow-lg"
                          >
                            <div className="bg-gradient-to-r from-indigo-500/30 to-purple-500/30 px-4 py-3 backdrop-blur-sm">
                              <h3 className="font-semibold text-gray-200">{problem.title} - {solution.language}</h3>
                            </div>
                            <div className="p-4 bg-base-200/20 backdrop-blur-sm">
                              <pre className="bg-base-300/50 p-4 rounded-lg text-sm overflow-x-auto backdrop-blur-sm">
                                <code className="font-mono text-gray-200">{solution.completeCode}</code>
                              </pre>
                            </div>
                          </motion.div>
                        )) || (
                          <div className="text-center py-12">
                            <div className="inline-block p-4 rounded-full bg-indigo-500/20 mb-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-300 mb-2">Solutions Awaiting</h3>
                            <p className="text-gray-400">Submit your solution to unlock community solutions</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeLeftTab === 'submissions' && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">My Submissions</h2>
                      <SubmissionHistory problemId={problemId}/>
                    </div>
                
                  )}

                  
                {activeLeftTab === 'chatAi' && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Chat with Aki-the AI</h2>
                      <ChatAi problem={problem}></ChatAi>
                    </div>
                  )}
                </motion.div>


              </AnimatePresence>
            )}
          </div>
        </motion.div>

        {/* Right Panel */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:w-1/2 flex flex-col bg-base-100/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden"
        >
          {/* Right Tabs */}
          <div className="flex border-b border-white/10 bg-base-200/20 backdrop-blur-sm px-4">
            {['code', 'testcase', 'result'].map((tab) => (
              <button
                key={tab}
                className={`relative px-4 py-3 font-medium text-sm transition-all duration-300 ${
                  activeRightTab === tab 
                    ? 'text-indigo-400' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                onClick={() => setActiveRightTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeRightTab === tab && (
                  <motion.div 
                    layoutId="rightTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right Content */}
          <div className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRightTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col"
              >
                {activeRightTab === 'code' && (
                  <div className="flex-1 flex flex-col">
                    {/* Language Selector */}
                    <div className="flex justify-between items-center p-4 border-b border-white/10">
                      <div className="flex gap-2">
                        {['javascript', 'java', 'cpp'].map((lang) => (
                          <motion.button
                            key={lang}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                              selectedLanguage === lang 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                                : 'bg-base-300/50 text-gray-300 hover:bg-base-300/70'
                            }`}
                            onClick={() => handleLanguageChange(lang)}
                          >
                            {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                          </motion.button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button className="text-gray-400 hover:text-gray-200 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                        <button className="text-gray-400 hover:text-gray-200 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Monaco Editor */}
                    <div className="flex-1">
                      <Editor
                        height="100%"
                        language={getLanguageForMonaco(selectedLanguage)}
                        value={code}
                        onChange={handleEditorChange}
                        onMount={handleEditorDidMount}
                        theme="vs-dark"
                        options={{
                          fontSize: 14,
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          tabSize: 2,
                          insertSpaces: true,
                          wordWrap: 'on',
                          lineNumbers: 'on',
                          glyphMargin: false,
                          folding: true,
                          lineDecorationsWidth: 10,
                          lineNumbersMinChars: 3,
                          renderLineHighlight: 'line',
                          selectOnLineNumbers: true,
                          roundedSelection: false,
                          readOnly: false,
                          cursorStyle: 'line',
                          mouseWheelZoom: true,
                        }}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 border-t border-white/10 flex justify-between bg-base-300/20 backdrop-blur-sm">
                      <div className="flex gap-2">
                        <button 
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-base-300/50 text-gray-300 hover:bg-base-300/70 transition-colors"
                          onClick={() => setActiveRightTab('testcase')}
                        >
                          <span className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Console
                          </span>
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                            loading ? 'bg-amber-600 text-white' : 'bg-amber-600/80 text-white hover:bg-amber-600'
                          }`}
                          onClick={handleRun}
                          disabled={loading}
                        >
                          {loading ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          Run
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                            loading ? 'bg-indigo-600 text-white' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90'
                          }`}
                          onClick={handleSubmitCode}
                          disabled={loading}
                        >
                          {loading ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          Submit
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}

                {activeRightTab === 'testcase' && (
                  <div className="flex-1 p-4 overflow-y-auto bg-base-200/10 backdrop-blur-sm">
                    <h3 className="font-semibold mb-4 text-xl text-gray-200">Test Results</h3>
                    {runResult ? (
                      <div className={`rounded-xl border p-5 mb-4 shadow-lg ${
                        runResult.success 
                          ? 'bg-emerald-500/10 border-emerald-500/30' 
                          : 'bg-rose-500/10 border-rose-500/30'
                      }`}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            runResult.success ? 'bg-emerald-500/20' : 'bg-rose-500/20'
                          }`}>
                            {runResult.success ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg" >
                              {runResult.success ? 'All Test Cases Passed!' : 'Test Cases Failed'}
                            </h4>
                            <div className="flex gap-4 text-sm mt-1">
                              <span className="flex items-center gap-1 text-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {runResult.runtime} sec
                              </span>
                              <span className="flex items-center gap-1 text-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                </svg>
                                {runResult.memory} KB
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 space-y-3">
                          {runResult.testCases.map((tc, i) => (
                            <motion.div 
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="bg-base-300/30 backdrop-blur-sm p-4 rounded-lg border border-white/10"
                            >
                              <div className="font-mono text-sm">
                                <div className="flex items-start mb-2">
                                  <span className="w-24 flex-shrink-0 text-gray-400">Input:</span>
                                  <span className="text-gray-200 break-all">{tc.stdin}</span>
                                </div>
                                <div className="flex items-start mb-2">
                                  <span className="w-24 flex-shrink-0 text-gray-400">Expected:</span>
                                  <span className="text-emerald-400 break-all">{tc.expected_output}</span>
                                </div>
                                <div className="flex items-start mb-2">
                                  <span className="w-24 flex-shrink-0 text-gray-400">Output:</span>
                                  <span className={tc.status_id === 3 ? 'text-emerald-400' : 'text-rose-400'}>{tc.stdout}</span>
                                </div>
                                <div className={`flex items-center gap-2 mt-2 pt-2 border-t border-white/10 ${
                                  tc.status_id === 3 ? 'text-emerald-400' : 'text-rose-400'
                                }`}>
                                  {tc.status_id === 3 ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  )}
                                  {tc.status_id === 3 ? 'Test Passed' : 'Test Failed'}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="inline-block p-4 rounded-full bg-indigo-500/20 mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">Test Results Pending</h3>
                        <p className="text-gray-400">Run your code to see the test results here</p>
                      </div>
                    )}
                  </div>
                )}

                {activeRightTab === 'result' && (
                  <div className="flex-1 p-4 overflow-y-auto bg-base-200/10 backdrop-blur-sm">
                    <h3 className="font-semibold mb-4 text-xl text-gray-200">Submission Result</h3>
                    {submitResult ? (
                      <div className={`rounded-xl border p-5 mb-4 shadow-lg ${
                        submitResult.accepted 
                          ? 'bg-emerald-500/10 border-emerald-500/30' 
                          : 'bg-rose-500/10 border-rose-500/30'
                      }`}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            submitResult.accepted ? 'bg-emerald-500/20' : 'bg-rose-500/20'
                          }`}>
                            {submitResult.accepted ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">
                              {submitResult.accepted ? 'Accepted' : 'Submission Failed'}
                            </h4>
                            <p className="text-sm text-gray-300 mt-1">
                              {submitResult.accepted 
                                ? 'Your solution passed all test cases' 
                                : submitResult.error || 'Some test cases failed'}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-6">
                          <div className="bg-base-300/30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                            <div className="text-2xl font-bold text-center mb-1">
                              {submitResult.passedTestCases}/{submitResult.totalTestCases}
                            </div>
                            <div className="text-center text-sm text-gray-400">Test Cases</div>
                          </div>
                          <div className="bg-base-300/30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                            <div className="text-2xl font-bold text-center mb-1">
                              {submitResult.runtime} sec
                            </div>
                            <div className="text-center text-sm text-gray-400">Runtime</div>
                          </div>
                          <div className="bg-base-300/30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                            <div className="text-2xl font-bold text-center mb-1">
                              {submitResult.memory} KB
                            </div>
                            <div className="text-center text-sm text-gray-400">Memory</div>
                          </div>
                        </div>

                        {!submitResult.accepted && (
                          <div className="mt-6 bg-rose-500/10 p-4 rounded-lg border border-rose-500/30">
                            <h5 className="font-semibold text-rose-400 mb-2">Error Details</h5>
                            <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                              {submitResult.errorDetails || 'No additional error information available'}
                            </pre>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="inline-block p-4 rounded-full bg-indigo-500/20 mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Submission Yet</h3>
                        <p className="text-gray-400">Submit your solution to see the evaluation results</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </CosmicBackground>
  );
};

export default ProblemPage;