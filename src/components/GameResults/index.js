import {Component} from 'react'
import Header from '../Header'
import './index.css'

class GameResults extends Component {
  render() {
    let {correctlyAttempted, totalQuestions, reports} = localStorage

    // Fallback to local storage data if props are not provided
    if (correctlyAttempted === undefined || totalQuestions === undefined) {
      const savedReport = JSON.parse(localStorage.getItem('quizResults'))
      correctlyAttempted = savedReport?.correctlyAttempted || 0
      totalQuestions = savedReport?.totalQuestions || 0
      reports = savedReport?.reports || []
    }

    const percentage = parseInt((correctlyAttempted / totalQuestions) * 100, 10)
    const totalCorrect = correctlyAttempted
    const totalUnattempted = reports.length
    const totalWrong = totalQuestions - (reports.length + correctlyAttempted)

    // Click handler for the "Report" button
    const onClickReport = () => {
      const {history} = this.props

      const quizResults = {
        correctlyAttempted: totalCorrect,
        totalQuestions,
        unAttemptedQuestions: totalUnattempted,
        wrongAnswers: totalWrong,
        reports,
      }

      localStorage.setItem('quizResults', JSON.stringify(quizResults))
      history.push('/game-report', quizResults)
    }

    return (
      <div className="quizgame-container">
        <Header />
        <div
          className={`quizgame-bottom-container ${
            percentage >= 60 ? 'won-background' : ''
          }`}
          style={{
            backgroundImage:
              percentage >= 60
                ? `url('https://assets.ccbp.in/frontend/react-js/quiz-game-congrats-card-bg.png')`
                : '',
          }}
        >
          {percentage >= 60 ? (
            <div className="results-content">
              <img
                src="https://assets.ccbp.in/frontend/react-js/quiz-game-congrats-trophy-img.png"
                alt="won"
                className="results-image"
              />
              <h1>Congrats</h1>
              <h1>{percentage}% Correctly Answered</h1>
              <p>Quiz completed successfully</p>
              <p>
                You attempted {correctlyAttempted} out of {totalQuestions}{' '}
                questions as correct
              </p>
            </div>
          ) : (
            <div className="results-content">
              <img
                src="https://assets.ccbp.in/frontend/react-js/quiz-game-lose-img.png"
                alt="lose"
                className="results-image"
              />
              <h1>{percentage}% Correctly Answered</h1>
              <h1>You lose</h1>
              <p>
                You attempted {correctlyAttempted} out of {totalQuestions}{' '}
                questions as correct
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={onClickReport}
            className="button-style"
          >
            Report
          </button>
        </div>
      </div>
    )
  }
}

export default GameResults
