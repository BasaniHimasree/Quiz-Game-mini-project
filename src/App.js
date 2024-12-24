import {Route, Switch} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import NotFound from './components/NotFound'
import QuizGameRoute from './components/QuizGameRoute'
import Home from './components/Home'
import GameReportRoute from './components/GameReportRoute'
import GameResults from './components/GameResults'
import './App.css'

const App = () => (
  <>
    <Switch>
      <Route exact path="/login" component={LoginForm} />
      <Route exact path="/" component={Home} />
      <Route exact path="/quiz-game" component={QuizGameRoute} />
      <Route exact path="/game-report" component={GameReportRoute} />
      <Route exact path="/game-results" component={GameResults} />
      <Route component={NotFound} />
    </Switch>
  </>
)

export default App
