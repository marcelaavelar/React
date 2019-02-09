import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AutorBox from './Autor';
import Home from './Home';
import LivroBox from './Livro';
import './index.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    (<Router>
        <App>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/autor" component={AutorBox} />
                <Route path="/livro" component={LivroBox}/>
            </Switch>
        </App>
    </Router>

    ),document.getElementById('root')
);

serviceWorker.unregister();
