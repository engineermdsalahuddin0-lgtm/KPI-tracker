import React from 'react';
import { Localized, useLanguage } from '../../i18n/index.jsx';
import { Bot, X, Send } from 'lucide-react';
export default function Assistant({ chat,setChat,history,setHistory,language,t,question,chooseQuestion,suggestions,suggestionsOpen,suggestionIndex,setSuggestionIndex,setSuggestionsOpen,ask,questionInput,setQuestion,dataset }) {

  return <Localized><>      <button
        className="chat-launch"
        aria-label="Open KPI assistant"
        onClick={() => setChat(!chat)}
      >
        {chat ? <X /> : <Bot />}
      </button>
      {chat && (
        <section className="chat-panel">
          <div className="chat-head">
            <Bot />
            <div>
              <b>KPI assistant</b>
              <small>Answers from your supplied dataset</small>
            </div>
            <button
              aria-label="Clear chat history"
              onClick={() => setHistory([])}
            >
              Clear
            </button>
          </div>
          <div className="chat-messages">
            {!history.length && (
              <>
                <h3>How can I help?</h3>
                <p>
                  Ask about KPIs, SMART goals, weights or department objectives.
                  বাংলা বা English-এ লিখুন।
                </p>
                {(language === 'bn' ? ['KPI কী?', 'KRA কী?', 'SMART KPI কী?'] : ['What is a KPI?', 'What is a KRA?', 'What is a SMART KPI?']).map((q) => (
                  <button key={q} onClick={() => chooseQuestion(q)}>
                    {q}
                  </button>
                ))}
              </>
            )}
            {history.map((h, i) => (
              <div key={i}>
                <div className="bubble user" data-user-content>{h.q}</div>
                <div className="bubble" data-user-content>
                  {h.a}
                  {h.source && <small>{t('Dataset reference:')} {h.source}</small>}
                </div>
              </div>
            ))}
          </div>
          {question.trim() && suggestionsOpen && <div className="question-suggestions">
            <div className="suggestion-heading"><b>{question.trim() ? 'Related questions' : 'Try these topics'}</b><small>Choose a question to fill the input</small></div>
            <div id="question-suggestions" role="listbox" aria-label={t('Related questions')}>
              {suggestions.map(({ record }, index) => <button type="button" role="option" aria-selected={suggestionIndex === index}
                id={`question-suggestion-${index}`} key={record.id} className={suggestionIndex === index ? 'active' : ''}
                onClick={() => chooseQuestion(record.metadata.question)} data-user-content>{record.metadata.question}</button>)}
            </div>
            {question.trim() && !suggestions.length && <small>No matching question. Try KPI, SMART, weight or a department name.</small>}
          </div>}
          <form onSubmit={ask}>
            <input
              ref={questionInput}
              role="combobox" aria-autocomplete="list" aria-controls={question.trim() && suggestionsOpen ? "question-suggestions" : undefined} aria-expanded={!!question.trim() && suggestionsOpen && suggestions.length > 0}
              aria-activedescendant={suggestionsOpen && suggestionIndex >= 0 ? `question-suggestion-${suggestionIndex}` : undefined}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown' && suggestionsOpen && suggestions.length) { e.preventDefault(); setSuggestionIndex((i) => (i + 1) % suggestions.length); }
                if (e.key === 'ArrowUp' && suggestionsOpen && suggestions.length) { e.preventDefault(); setSuggestionIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1)); }
                if (e.key === 'Enter' && suggestionsOpen && suggestionIndex >= 0) { e.preventDefault(); chooseQuestion(suggestions[suggestionIndex].record.metadata.question); }
                if (e.key === 'Escape') { setSuggestionIndex(-1); setSuggestionsOpen(false); }
              }}
              aria-label="Question for KPI assistant"
              value={question}
              onChange={(e) => { setQuestion(e.target.value); setSuggestionsOpen(true); }}
              placeholder="Ask a KPI question…"
            />
            <button
              className="primary"
              disabled={!dataset.length}
              aria-label="Send question"
            >
              <Send size={18} />
            </button>
          </form>
          <small className="chat-note">
            Local text matching · no external AI service
          </small>
        </section>
      )}</></Localized>;
}
