'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { Volume2 } from 'lucide-react'

export default function MCQuizPage() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const direction = searchParams.get('direction') || 'word2mean'
  const router = useRouter()

  const [quizType, setQuizType] = useState(null)
  const [questions, setQuestions] = useState([])
  const [shuffledOrder, setShuffledOrder] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [finished, setFinished] = useState(false)
  const [incorrects, setIncorrects] = useState([])
  const [options, setOptions] = useState([])

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await axios.get(`/api/quizsets/${id}`)
      setQuizType(res.data.type)
      setQuestions(res.data.questions)
    }
    fetchQuiz()
  }, [id])

  useEffect(() => {
    if (!quizType || questions.length === 0) return

    const progressType =
      quizType === 'QA'
        ? 'QA_CHOICE'
        : (direction === 'mean2word' ? 'REVERSE_CHOICE' : 'CHOICE')

    let order = [...Array(questions.length).keys()].sort(() => Math.random() - 0.5)
    let cur = 0
    let incs = []

    const fetchProgress = async () => {
      try {
        const progRes = await axios.get(`/api/quizsets/${id}/progress?type=${progressType}`)
        const progArr = progRes.data.progresses || []
        const prog = progArr.find(p => p.type === progressType)?.data
        if (prog && prog.shuffledOrder && prog.currentIndex != null) {
          order = prog.shuffledOrder
          cur = prog.currentIndex
          incs = prog.incorrects || []
        } else {
          await axios.put(`/api/quizsets/${id}/progress?type=${progressType}`, {
            currentIndex: 0, shuffledOrder: order, incorrects: []
          })
        }
      } catch (e) {
        await axios.put(`/api/quizsets/${id}/progress?type=${progressType}`, {
          currentIndex: 0, shuffledOrder: order, incorrects: []
        })
      }
      setShuffledOrder(order)
      setCurrent(cur)
      setIncorrects(incs)
    }
    fetchProgress()
    // eslint-disable-next-line
  }, [quizType, questions, id, direction])

  const q = (questions && shuffledOrder && typeof shuffledOrder[current] !== "undefined")
    ? questions[shuffledOrder[current]]
    : undefined

  useEffect(() => {
    if (!q) return
    let answer, allAnswers
    if (quizType === 'QA') {
      answer = q.answer
      allAnswers = [...new Set(questions.map(q => q.answer))]
    } else {
      answer = direction === 'mean2word' ? q.content : q.answer
      allAnswers = [...new Set(questions.map(q => (direction === 'mean2word' ? q.content : q.answer)))]
    }
    const filtered = allAnswers.filter(a => a !== answer).sort(() => Math.random() - 0.5).slice(0, 3)
    setOptions(shuffle([...filtered, answer]))
    setSelected(null)
    setShowResult(false)
  }, [current, questions, q, direction, quizType])

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

  // showResult를 true로 바꾸는 역할은 선택지/잘 모르겠습니다 둘 다 동일!
  const handleSelect = (option) => {
    if (selected !== null) return
    setSelected(option)
    setShowResult(true)
  }

  const getProgressType = () => (
    quizType === 'QA'
      ? 'QA_CHOICE'
      : (direction === 'mean2word' ? 'REVERSE_CHOICE' : 'CHOICE')
  )

  const next = async () => {
    let answer
    if (quizType === 'QA') {
      answer = q.answer
    } else {
      answer = direction === 'mean2word' ? q.content : q.answer
    }
    const isCorrect = selected === answer
    const newIncorrects = !isCorrect ? [...incorrects, shuffledOrder[current]] : incorrects

    const nextIndex = current + 1
    await axios.put(`/api/quizsets/${id}/progress?type=${getProgressType()}`, {
      currentIndex: nextIndex,
      shuffledOrder,
      incorrects: newIncorrects,
      lastAnswer: selected,
    })

    if (nextIndex >= shuffledOrder.length) {
      setFinished(true)
    } else {
      setCurrent(nextIndex)
    }
    setIncorrects(newIncorrects)
  }

  const handleRestart = async () => {
    const newOrder = [...Array(questions.length).keys()].sort(() => Math.random() - 0.5)
    await axios.put(`/api/quizsets/${id}/progress?type=${getProgressType()}`, {
      currentIndex: 0,
      shuffledOrder: newOrder,
      incorrects: [],
    })
    setShuffledOrder(newOrder)
    setCurrent(0)
    setIncorrects([])
    setSelected(null)
    setShowResult(false)
    setFinished(false)
  }

  const speak = (text) => {
    window.speechSynthesis.cancel()
    const utterance = new window.SpeechSynthesisUtterance(text)
    const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text)
    utterance.lang = isKorean ? 'ko-KR' : 'en-US'
    window.speechSynthesis.speak(utterance)
  }

  if (quizType === null || questions.length === 0 || !q && !finished) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-xl" style={{ color: 'var(--text-color)' }}>
        불러오는 중…
      </div>
    )
  }

  if (finished) {
    const score = questions.length - incorrects.length
    const total = questions.length
    const percent = total === 0 ? 0 : Math.round((score / total) * 100)

    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)] px-4">
        <div className="max-w-md w-full bg-[var(--input-bg)] p-8 rounded-3xl shadow-2xl space-y-8 text-center border border-[var(--border-color)]">
          {/* 점수 원형 Progress */}
          <div className="flex justify-center">
            <div className="relative flex items-center justify-center w-28 h-28">
              {/* 배경 원 */}
              <svg className="absolute top-0 left-0" width="112" height="112">
                <circle
                  cx="56" cy="56" r="48"
                  stroke="var(--border-color)"
                  strokeWidth="14"
                  fill="none"
                />
                {/* progress 원 */}
                <circle
                  cx="56" cy="56" r="48"
                  stroke="#3b82f6"
                  strokeWidth="14"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - score / total)}
                  strokeLinecap="round"
                  transform="rotate(-90 56 56)"
                  style={{ transition: 'stroke-dashoffset 0.7s' }}
                />
              </svg>
              <span className="text-2xl font-extrabold text-blue-500 z-10 select-none">{score} / {total}</span>
            </div>
          </div>
          {/* 퀴즈 완료 텍스트 */}
          <h2 className="text-2xl font-bold mb-0 mt-2 tracking-tight">퀴즈 완료</h2>
          <p className="text-lg font-semibold text-gray-500 dark:text-gray-300">정답률 <span className="font-bold text-blue-500">{percent}%</span></p>

          {/* 틀린 문제 */}
          {incorrects.length > 0 && (
            <div className="mt-3 text-left">
              <h3 className="font-bold mb-2 text-red-500">틀린 문제</h3>
              <div className="space-y-2">
                {incorrects.map(i => (
                  <div key={i} className="p-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border-color)] text-sm shadow-sm">
                    <div className="mb-1">
                      <span className="font-bold">문제:</span>
                      <span className="ml-2 text-[var(--subtext-color)]">
                        {quizType === 'QA'
                          ? questions[i]?.content
                          : (direction === 'mean2word' ? questions[i]?.answer : questions[i]?.content)
                        }
                      </span>
                    </div>
                    <div>
                      <span className="font-bold">정답:</span>
                      <span className="ml-2" style={{ color: 'var(--danger-text)' }}>
                        {quizType === 'QA'
                          ? questions[i]?.answer
                          : (direction === 'mean2word' ? questions[i]?.content : questions[i]?.answer)
                        }
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* 다시 하기 버튼 */}
          <button
            onClick={handleRestart}
            className="mt-8 px-7 py-3 rounded-2xl font-bold bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-lg text-white shadow transition"
          >
            다시 하기
          </button>
        </div>
      </div>
    )
  }

  let prompt
  if (quizType === 'QA') {
    prompt = q.content
  } else {
    prompt = direction === 'mean2word' ? q.answer : q.content
  }
  const total = questions.length

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)] px-2">
      <div className="w-full max-w-xl bg-[var(--input-bg)] p-8 rounded-2xl shadow-xl border border-[var(--border-color)] space-y-7">
        {/* 진행도 바 */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1 h-3 rounded-full bg-gray-200 dark:bg-zinc-500 overflow-hidden">
            <div
              className="h-3 rounded-full bg-[var(--button-bg)] transition-all"
              style={{ width: `${((current + 1) / total) * 100}%` }}
            />
          </div>
          <span className="text-sm font-semibold min-w-max ml-2">{current + 1} / {total}</span>
        </div>

        {/* 문제 */}
        <div className="flex flex-row items-center gap-2 text-lg sm:text-2xl font mb-4">
          <span>{prompt}</span>
          <button
            onClick={() => speak(prompt)}
            className="ml-2 text-blue-400 hover:text-blue-700"
            title="문제 읽기"
            type="button"
          >
            <Volume2 size={22} />
          </button>
        </div>

        {/* 선택지 */}
        <div className="grid gap-4">
          {options.map((option, idx) => {
            let answer
            if (quizType === 'QA') {
              answer = q.answer
            } else {
              answer = direction === 'mean2word' ? q.content : q.answer
            }
            const isSelected = selected === option
            const isCorrect = option === answer

            let buttonClass = `
    w-full px-4 py-3 rounded-xl border shadow transition
    flex items-center gap-3
  `

            if (showResult) {
              if (isCorrect) {
                buttonClass += ' bg-[var(--selected-bg)] text-[var(--selected-text)] border-[var(--selected-bg)]'
              } else if (selected && isSelected && !isCorrect) {
                buttonClass += ' bg-[var(--danger-text)] text-white border-[var(--danger-hover)]'
              } else {
                buttonClass += ' bg-[var(--input-bg)] text-[var(--text-color)] border-[var(--border-color)] opacity-60'
              }
            } else {
              buttonClass += ' bg-[var(--input-bg)] text-[var(--text-color)] border-[var(--border-color)] hover:bg-[var(--button-hover-bg)] hover:text-white'
            }

            return (
              <button
                key={idx}
                disabled={showResult}
                onClick={() => handleSelect(option)}
                className={buttonClass}
                style={{ fontSize: '1.1rem' }}
              >
                <span className="flex-1 text-left">{option}</span>
                <span
                  onClick={e => { e.stopPropagation(); speak(option); }}
                  title="읽기"
                  className="ml-2 cursor-pointer text-blue-400 hover:text-blue-600 text-base flex items-center"
                >
                  <Volume2 size={18} />
                </span>
              </button>
            )
          })}
        </div>

        {/* 다음 문제 버튼 */}
        {showResult && (
          <div className="text-center mt-4">
            <button
              onClick={next}
              className="px-6 py-2 rounded-xl font-semibold bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white shadow transition"
            >
              다음 문제 →
            </button>
          </div>
        )}

        {/* 모르겠어요 */}
        {!showResult && (
          <button
            onClick={() => handleSelect('')}
            className="block mx-auto mt-2 text-sm text-gray-400 underline"
          >
            잘 모르겠습니다
          </button>
        )}
      </div>
    </div>
  )
}
