import {Component} from 'react'
import {Switch, Route, BrowserRouter as Router} from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Popular from './components/Popular'
import TopRated from './components/TopRated'
import Upcoming from './components/Upcoming'
import Footer from './components/Footer'
import Context from './Context/Context'
import SingleMovieDetails from './components/SingleMovieDetails'
import SearchMoviesDetails from './components/SearchMoviesDetails'

class App extends Component {
  state = {search: '', currentPage: 1, searchList: [], loading: true}

  componentDidMount() {
    this.getPopularMovies()
  }

  caseConvert = arr =>
    arr.map(item => ({
      id: item.id,
      posterPath: item.poster_path,
      title: item.title,
      voteAverage: item.vote_average,
    }))

  getPopularMovies = async () => {
    const {currentPage} = this.state
    const PopularApi = `https://api.themoviedb.org/3/movie/popular?api_key=b24ca4a28f7cce57aca325b6f144c729&language=en-US&page=${currentPage}`
    const response = await fetch(PopularApi)
    if (response.ok) {
      const dataObj = await response.json()
      const modifiedMovieList = this.caseConvert(dataObj.results)
      this.setState({searchList: modifiedMovieList, loading: false})
    }
  }

  searchFn = query => {
    this.setState({search: query, loading: true}, this.getSearchMovies)
  }

  getSearchMovies = async () => {
    const {currentPage, search} = this.state
    const SearchApi = `https://api.themoviedb.org/3/search/movie?api_key=b24ca4a28f7cce57aca325b6f144c729&language=en-US&query=${search}&page=${currentPage}`
    const response = await fetch(SearchApi)
    if (response.ok) {
      const dataObj = await response.json()
      const modifiedMovieList = this.caseConvert(dataObj.results)
      this.setState({searchList: modifiedMovieList, loading: false})
    }
  }

  turnPage = () => {
    this.setState(
      prevState => ({currentPage: prevState.currentPage + 1, loading: true}),
      this.getPopularMovies,
    )
  }

  render() {
    const {search, searchList, loading, currentPage} = this.state
    return (
      <Context.Provider
        value={{
          search,
          loading,
          currentPage,
          searchList,
          searchFn: this.searchFn,
          turnPage: this.turnPage,
        }}
      >
        <Router>
          <main className="main-container">
            <Header />
            <Switch>
              <Route exact path="/" component={Popular} />
              <Route exact path="/top-rated" component={TopRated} />
              <Route exact path="/upcoming" component={Upcoming} />
              <Route exact path="/movie/:id" component={SingleMovieDetails} />
              <Route exact path="/search" component={SearchMoviesDetails} />
            </Switch>
            <Footer />
          </main>
        </Router>
      </Context.Provider>
    )
  }
}

export default App
