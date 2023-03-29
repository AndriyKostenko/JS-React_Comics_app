import { Component } from 'react';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';

import './randomChar.scss';

import mjolnir from '../../resources/img/mjolnir.png';
import MarvelService from '../../services/MarvelService';


class RandomChar extends Component{

    // created state (char - all null), by default loading - true before getting info
    state = {
        char: {},
        loading: true,
        error: false,
    }

    marvelService = new MarvelService();

    //after constructor (here doesnt exist) creating necces. functionality
    componentDidMount() {
        this.updateChar();
    }

    componentWillUnmount() {
    }

    //cathing error and notifiying user
    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    onCharLoaded = (char) => {
        this.setState({
            char, 
            loading: false}) // when all data succss. loaded - loading will set to false
    }

    onCharLoading = (char) => {
        this.setState({
            loading: true
        })
    }

    //updating state with received info from API
    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000); // range of characters id from website
        this.onCharLoading();
        this.marvelService
            .getCharacter(id)
            .then(this.onCharLoaded) // argument 'char' will be iserted automatically 
            .catch(this.onError);
        }

    render() {
        const {char, loading, error} = this.state;
        const error_message = error ? <ErrorMessage/> :null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <View char={char}/> : null;

        // created case if loading still in progress or not to show necc. info only
        return (
            <div className="randomchar">
                {error_message}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button onClick={this.updateChar} className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }

}

// charachter view
const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;
    //checking for missed character's photo and fixing error photo from server
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit': 'contain'}
    }

    return (
        <div className="randomchar__block">
        <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;