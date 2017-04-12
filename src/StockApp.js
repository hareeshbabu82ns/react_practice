/**
 * Created by hareesh on 12-04-2017.
 */

import React from "react";

import _ from "lodash";
import 'bootstrap/dist/css/bootstrap.css';

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
                            <input className="form-check-input" value={this.props.inStockOnly}
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
    {
        "id": 1,
        "category": "Outdoors",
        "price": "458.00",
        "stocked": true,
        "name": "Unbranded Wooden Tuna"
    },
    {
        "id": 2,
        "category": "Jewelery",
        "price": "870.00",
        "stocked": false,
        "name": "Generic Cotton Pizza"
    },
    {
        "id": 3,
        "category": "Garden",
        "price": "384.00",
        "stocked": false,
        "name": "Sleek Plastic Chicken"
    },
    {
        "id": 4,
        "category": "Music",
        "price": "116.00",
        "stocked": false,
        "name": "Awesome Concrete Bacon"
    },
    {
        "id": 5,
        "category": "Industrial",
        "price": "794.00",
        "stocked": false,
        "name": "Ergonomic Granite Ball"
    },
    {
        "id": 6,
        "category": "Outdoors",
        "price": "122.00",
        "stocked": true,
        "name": "Ergonomic Fresh Table"
    },
    {
        "id": 7,
        "category": "Movies",
        "price": "711.00",
        "stocked": false,
        "name": "Ergonomic Concrete Chips"
    },
    {
        "id": 8,
        "category": "Kids",
        "price": "849.00",
        "stocked": false,
        "name": "Practical Granite Chips"
    },
    {
        "id": 9,
        "category": "Movies",
        "price": "110.00",
        "stocked": false,
        "name": "Generic Fresh Towels"
    },
    {
        "id": 10,
        "category": "Shoes",
        "price": "244.00",
        "stocked": true,
        "name": "Intelligent Soft Shirt"
    }
];

/*
 *  StockApp is the root component
 */
export default class StockApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterText: '',
            inStockOnly: false
        };
    }

    render() {
        return (
            <div className="container">
                <StockSearchBar
                    filterText={this.state.filterText}
                    onFilterText={(text) => this.setState({filterText: text})}
                    inStockOnly={this.state.inStockOnly}
                    onStockOnly={(checked) => this.setState({inStockOnly: checked})}
                />
                <StockTable items={stocks}
                            filterText={this.state.filterText} inStockOnly={this.state.inStockOnly}/>
            </div>
        )
    }
}
