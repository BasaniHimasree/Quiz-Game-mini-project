import Cookies from 'js-cookie'
import {Link, Redirect} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <div className="home-container">
      <Header />
      <div className="home-bottom-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/quiz-game-start-the-quiz-img.png"
          alt="start quiz game"
          className="startQuizGame-logo"
        />
        <h1 className="home-heading">
          How Many Of These Questions Do You Actually Know?
        </h1>
        <p className="home-paragraph">
          Test yourself with these easy quiz questions and answers
        </p>
        <Link to="/quiz-game">
          <button type="button" className="start-qiuz-button">
            Start Quiz
          </button>
        </Link>
        <div className="warning-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/quiz-game-error-img.png"
            alt="warning icon"
            className="warning-icon"
          />
          <p className="warning-paragraph">
            All the progress will be lost, if you reload during the quiz
          </p>
        </div>
      </div>
    </div>
  )
}
export default Home
