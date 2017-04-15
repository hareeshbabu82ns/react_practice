/**
 * Created by hareesh on 12-04-2017.
 */

import React from "react";
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider, connect} from 'react-redux';
import thunk from 'redux-thunk';

import _ from "lodash";
import 'bootstrap/dist/css/bootstrap.css';

/*
 * Redux Setup
 */

// Action IDs
const ACTION_IN_STOCK_ONLY = "instockonly";
const ACTION_STOCK_FILTER = "stockfilter";
const ACTION_UPDATE_STOCKS = "updatestocks";
const ACTION_FETCH_STOCKS_ASYNC = "fetchstocksasync";
const ACTION_FETCH_STOCKS = "fetchstocks";
const ACTION_CANCEL_FETCH_STOCKS = "cancelfetchstocks";

// Action Creators
function actionInStockOnly(inStockOnly) {
    return {
        type: ACTION_IN_STOCK_ONLY,
        payload: inStockOnly
    };
}
function actionStockFilter(filter) {
    return {
        type: ACTION_STOCK_FILTER,
        payload: filter
    };
}
function actionFetchStocks() {
    return {
        type: ACTION_FETCH_STOCKS,
        payload: ''
    }
}
function actionCancelFetchStocks() {
    return {
        type: ACTION_FETCH_STOCKS,
        payload: ''
    }
}
function actionUpdateStocks(stocks) {
    return {
        type: ACTION_UPDATE_STOCKS,
        payload: stocks
    }
}

// Fetch Stocks from Server using Thunk action
function actionFetchStocksAsync() {
    //return a function to Thunk to call Async.ly
    return (dispatch) => {
        //set flag that we started fetching
        dispatch(actionFetchStocks());

        //actual fetch of the data from server
        fetch('http://localhost:3680/stocks')
            .then(result => result.json())
            .then(stocks => {
                //update the stocks into Redux State
                dispatch(actionUpdateStocks(stocks));

                //clear fetching flag
                dispatch(actionCancelFetchStocks());
            })
            .catch(error => {
                //handle error properly
                console.log(error.message);
                //clear fetching flag
                dispatch(actionCancelFetchStocks());
            });
    }
}


// Reducers
function inStockOnlyReducer(state = false, action) {
    switch (action.type) {
        case ACTION_IN_STOCK_ONLY:
            return action.payload;
        default:
            return state;
    }
}
function stocksReducer(state = [], action) {
    switch (action.type) {
        case ACTION_UPDATE_STOCKS:
            return action.payload;
        default:
            return state;
    }
}
function stocksFilterReducer(state = '', action) {
    switch (action.type) {
        case ACTION_STOCK_FILTER:
            return action.payload;
        default:
            return state;
    }
}
const initGeneralState = {
    fetchingStocks: false,
    someProps: 'testProps'
};
function stocksGeneralReducer(state = initGeneralState, action) {
    switch (action.type) {
        case ACTION_FETCH_STOCKS:
            return {fetchingStocks: true};
        case ACTION_CANCEL_FETCH_STOCKS:
            return {fetchingStocks: false};

        default:
            return state;
    }
}

/*
 * UI APP
 */

/*
 * StockItemRow to display leaf node of stock list
 */
class StockItemRow extends React.Component {
    render() {
        let name = this.props.stock.stocked ?
            this.props.stock.name :
            <span style={{color: 'red'}}>{this.props.stock.name}</span>;
        return (
            <div className="row">
                <div className="col">{name}</div>
                <div className="col"> ${this.props.stock.price}</div>
            </div>
        )
    }
}

/*
 * StockItemCategoryRow to display StockItemRow headers
 */
function StockItemCategoryRow(props) {
    return (
        <div className="row">
            <div className="col h6">{props.value}</div>
        </div>
    )
}

/*
 * StockItemCategoryRow to display StockItemRow headers
 */
class StockTable extends React.Component {

    render() {
        let items = this.props.items;
        if (this.props.inStockOnly)
            items = _.filter(items, 'stocked');
        if (this.props.filterText.length > 0)
            items = _.filter(items, (item) => item.name.includes(this.props.filterText));

        let stocksSorted = _.sortBy(items, 'category');
        let category = '';
        let rows = [];
        stocksSorted.forEach((stock) => {
            if (category !== stock.category) { //new category
                rows.push(<StockItemCategoryRow value={stock.category} key={stock.category}/>);
                category = stock.category;
            }
            rows.push(<StockItemRow stock={stock} key={stock.id}/>)
        });
        return (
            <div className="container">
                <div className="row">
                    <div className="col h5">Name</div>
                    <div className="col h5">Price</div>
                </div>
                {rows}
            </div>
        )
    }
}

/*
 * StockSearchBar to display StockListItems
 */
class StockSearchBar extends React.Component {
    constructor(props) {
        super(props);

        //Event Handlers - need to bind to THIS
        this.onFilterText = this.onFilterText.bind(this);
        this.onStockOnly = this.onStockOnly.bind(this);
    }

    onFilterText(e) {
        this.props.onFilterText(e.target.value); //emit to parent
    }

    onStockOnly(e) {
        this.props.onStockOnly(e.target.checked); //emit to parent
    }

    render() {
        return (
            <div className="container">
                <form className="form-inline">
                    <input type="text" className="form-control mb-2 mr-sm-2 mb-sm-0"
                           id="inlineFormInput" value={this.props.filterText}
                           onChange={this.onFilterText}
                           placeholder="Search Stocks..."/>
                    <div className="form-check mb-2 mr-sm-2 mb-sm-0">
                        <label className="form-check-label">
                            <input className="form-check-input" checked={this.props.inStockOnly}
                                   onChange={this.onStockOnly}
                                   type="checkbox"/> Display Only Stocked Items
                        </label>
                    </div>
                </form>
            </div>
        )
    }
}


const stocks = [

];


/*
 *  StockApp is the root component
 */
export class StockApp extends React.Component {
    constructor(props) {
        super(props);

        // this.state = {
        //     stocks: this.props.stocks,
        //     filterText: this.props.filterText,
        //     inStockOnly: this.props.inStockOnly
        // };

        this.onFetchStocks = this.onFetchStocks.bind(this);

        this.onFetchStocks();
    }

    onFetchStocks() {
        this.props.onFetchStocks();
    }

    render() {
        return (
            <div className="container">
                <StockSearchBar
                    filterText={this.props.filterText}
                    onFilterText={(text) => this.setState({filterText: text})}
                    inStockOnly={this.props.inStockOnly}
                    onStockOnly={(checked) => this.setState({inStockOnly: checked})}
                />
                <StockTable items={this.props.stocks}
                            filterText={this.props.filterText} inStockOnly={this.props.inStockOnly}/>
            </div>
        )
    }
}
const getInStocks = (stocks, inStockOnly) => {
    return (inStockOnly) ?
        stocks.filter(stock => stock.stocked) : stocks;
};

const mapStateToProps_SearchBar = (state) => {
    return {
        filterText: state.filterText,
        inStockOnly: state.inStockOnly
    }
};

const mapDispatchToProps_SearchBar = (dispatch) => {
    return {
        onFilterText(filterText){
            dispatch(actionStockFilter(filterText));
        },
        onStockOnly(checked){
            dispatch(actionInStockOnly(checked));
        }
    }
};

StockSearchBar = connect(mapStateToProps_SearchBar, mapDispatchToProps_SearchBar)(StockSearchBar);

const mapStateToProps = (state) => {
    return {
        stocks: getInStocks(state.stocks, state.inStockOnly),
        filterText: state.filterText,
        inStockOnly: state.inStockOnly,
        general: state.general
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        onFetchStocks(){
            dispatch(actionFetchStocksAsync());
        }
    }
};
const StockAppReduxContainer = connect(mapStateToProps, mapDispatchToProps)(StockApp);

/*
 * Initialize Redux
 */
const initailState = {
    stocks: stocks,
    filterText: '',
    inStockOnly: false,
    general: initGeneralState
};

const appReducer = combineReducers({
    stocks: stocksReducer,
    filterText: stocksFilterReducer,
    inStockOnly: inStockOnlyReducer,
    general: stocksGeneralReducer
});

const store = applyMiddleware(thunk)(createStore)(appReducer, initailState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// const store = createStore(appReducer, initailState,
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );


/*
 * StockStoreProviderApp - Store Provider Component
 */
export default function StockStoreProviderApp(props) {
    return (
        <Provider store={store}>
            <StockAppReduxContainer/>
        </Provider>
    )
}
