import { useState, useEffect, useMemo, useRef } from 'react';
import { useLanguage } from '../../i18n/index.jsx';
import { findAnswer, rankQuestions } from './search.mjs';
export default function useAssistant() {
  const { language, t } = useLanguage();
  const questionInput = useRef(null);
  const [chat,setChat] = useState(false), [dataset,setDataset] = useState([]), [question,setQuestion] = useState(''), [suggestionIndex,setSuggestionIndex] = useState(-1), [suggestionsOpen,setSuggestionsOpen] = useState(false);
  const [history,setHistory] = useState(() => {try {return JSON.parse(localStorage.getItem('bitopi-chat')) || [];} catch {return [];}});
  useEffect(() => {
    localStorage.setItem('bitopi-chat', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}Bitopi_KPI_QA_RAG.jsonl`)
      .then((r) => r.text())
      .then((t) =>
        setDataset(
          t
            .split('\n')
            .filter((x) => x.trim())
            .map((x) => JSON.parse(x)),
        ),
      )
      .catch(() => setDataset([]));
  }, []);

  const suggestions = useMemo(() => rankQuestions(dataset, question, language), [dataset, question, language]);
  useEffect(() => setSuggestionIndex(-1), [question, language]);
  function chooseQuestion(text) {
    setSuggestionsOpen(false);
    setQuestion(text);
    setSuggestionIndex(-1);
    questionInput.current?.focus();
  }

  function ask(e) {
    e.preventDefault();
    if (!question.trim()) return;
    const q = question.trim();
    const best = findAnswer(dataset, q, language);
    const answer = best ? best.metadata.answer : language === 'bn'
      ? 'মিল আছে এমন উত্তর পাওয়া যায়নি। KPI, SMART বা গুরুত্ব লিখে নিচের প্রস্তাবিত প্রশ্ন থেকে বেছে নিন।'
      : 'No matching answer found. Type KPI, SMART or weight and choose a suggested question.';
    setHistory((h) => [...h, { q, a: answer, source: best?.id || null }]);
    setQuestion('');
  }

  return {chat,setChat,dataset,question,setQuestion,history,setHistory,language,t,questionInput,suggestionIndex,setSuggestionIndex,suggestionsOpen,setSuggestionsOpen,suggestions,chooseQuestion,ask};
}
