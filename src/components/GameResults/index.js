import {Link} from 'react-router-dom'
import {Component} from 'react'

import './index.css'

class GameResults extends Component {
  render() {
    const {correctlyAttempted = 0, totalQuestions = 1} = this.props

    const number = (correctlyAttempted / totalQuestions) * 100
    const percentage = parseInt(number)

    return (
      <div className="results-container">
        {percentage >= 60 ? (
          <>
            <img
              src="https://assets.ccbp.in/frontend/react-js/quiz-game-congrats-trophy-img.png"
              alt="won"
              className="results-image"
            />
            <h1>Congrats</h1>
            <h1>{percentage}% Correctly Answered</h1>
            <h1>Quiz completed successfully</h1>
            <p>
              You attempted {correctlyAttempted} out of {totalQuestions}{' '}
              questions as correct
            </p>
            <Link to="/game-report">
              <button type="button">Report</button>
            </Link>
          </>
        ) : (
          <>
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
            <Link to="/game-report">
              <button type="button">Report</button>
            </Link>
          </>
        )}
      </div>
    )
  }
}
export default GameResults
