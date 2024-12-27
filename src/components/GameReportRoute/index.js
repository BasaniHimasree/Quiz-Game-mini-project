import {Component} from 'react'
import Header from '../Header'
import './index.css'

class GameReportRoute extends Component {
  render() {
    let {
      correctlyAttempted,
      totalQuestions,
      unAttemptedQuestions,
      wrongAnswers,
      reports,
    } = localStorage

    if (
      correctlyAttempted === undefined ||
      totalQuestions === undefined ||
      unAttemptedQuestions === undefined ||
      wrongAnswers === undefined
    ) {
      const savedReport = JSON.parse(localStorage.getItem('quizResults'))
      correctlyAttempted = savedReport?.correctlyAttempted || 0
      totalQuestions = savedReport?.totalQuestions || 0
      unAttemptedQuestions = savedReport?.unAttemptedQuestions || 0
      wrongAnswers = savedReport?.wrongAnswers || 0
      reports = savedReport?.reports || []
    }
    console.log(reports, reports.options, wrongAnswers)

    return (
      <div className="quizgame-container">
        <Header />
        <div className="quizgame-bottom-container">
          <p>
            {totalQuestions}/{totalQuestions}
          </p>
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/quiz-game-right-check-img.png"
              alt="correct answer icon"
            />
            <p>{correctlyAttempted} Correct answers</p>
          </div>
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/quiz-game-wrong-check-img.png"
              alt="incorrect answer icon"
            />
            <p>{wrongAnswers} Incorrect answers</p>
          </div>
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/quiz-game-un-answered-img.png"
              alt="unattempted icon"
            />
            <p>{unAttemptedQuestions} Unattempted answers</p>
          </div>

          <div>
            {reports.length === 0 ? (
              <h1>Attempted all the questions</h1>
            ) : (
              <div>
                <h1>Unattempted Questions</h1>
                <div>
                  {reports.map(question => (
                    <div key={question.id}>
                      <h1 className="question">{question.question_text}</h1>
                      <ul>
                        {question.options.map(option => {
                          const isCorrect = option.is_correct === 'true'
                          return (
                            <li key={option.id}>
                              {question.options_type === 'DEFAULT' && (
                                <div className="image-option-container">
                                  <button
                                    type="button"
                                    className="onclick-button"
                                    style={{
                                      backgroundColor: isCorrect
                                        ? '#1c944b'
                                        : 'transparent',
                                    }}
                                  >
                                    {option.text}
                                  </button>
                                  {isCorrect && (
                                    <img
                                      src="https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png"
                                      alt="correct checked circle"
                                      className="correct-icon"
                                    />
                                  )}
                                </div>
                              )}

                              {question.options_type === 'IMAGE' && (
                                <div className="image-option-container">
                                  <img
                                    src={option.image_url}
                                    alt={option.text}
                                    className="image-button"
                                    style={{
                                      border: isCorrect
                                        ? '3px solid #1c944b'
                                        : 'none',
                                    }}
                                  />
                                  {isCorrect && (
                                    <img
                                      src="https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png"
                                      alt="correct checked circle"
                                      className="correct-icon"
                                    />
                                  )}
                                </div>
                              )}

                              {question.options_type === 'SINGLE_SELECT' && (
                                <div className="single-select-container">
                                  <input
                                    type="radio"
                                    id={option.id}
                                    name={`quiz-option-${question.id}`}
                                    className="option-radio"
                                    defaultChecked={isCorrect}
                                  />
                                  <label
                                    htmlFor={option.id}
                                    className="radio-label"
                                    style={{
                                      color: isCorrect ? '#1c944b' : 'inherit',
                                    }}
                                  >
                                    {option.text}
                                  </label>
                                  {isCorrect && (
                                    <img
                                      src="https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png"
                                      alt="correct checked circle"
                                      className="correct-icon"
                                    />
                                  )}
                                </div>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}
export default GameReportRoute
