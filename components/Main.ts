/// <reference path="../typings/tsd.d.ts"/>

import Product = require("./Product");
import React = require("react")

var products = [
  new Product('Sporting Goods', '$49.99',  true, 'Football'),
  new Product('Sporting Goods', '$9.99', true,  'Baseball'),
  new Product('Sporting Goods', '$29.99',  false,  'Basketball'),
  new Product('Electronics', '$99.99',  true,  'iPod Touch'),
  new Product('Electronics',  '$399.99',  false,  'iPhone 5'),
  new Product('Electronics',  '$199.99',  true,  'Nexus 7')
]


class ProductRow extends React.Component<{product:Product, key:number},any> {

    render = () => {

      var product = this.props.product

      var name = product.stocked ?
                product.name :
                React.DOM.span({style: {color: 'red'}}, product.name)


      return React.DOM.tr(null,
              React.DOM.td(null, name),
              React.DOM.td(null, product.price)
      )
    }
}

class ProductCategoryRow extends React.Component<{key:string},any> {

   render = () => {
      return React.DOM.tr(null,
               React.DOM.th({colSpan: 2}, this.props.key)
      )
   }
}


interface ProductInterface {
  products:Array<Product>
  searchInterface:SearchInterface
}

class ProductTable extends React.Component<ProductInterface,any> {

  render = () => {
    var components:Array<React.ReactElement<any>>

    var products:Array<Product> = []
    for (var x in this.props.products) {
      products.push(this.props.products[x])
    }



    console.log(products)

    var components =  products
    .filter (product => {
      var filterMatch = product.name.toLowerCase().indexOf(this.props.searchInterface.filterText.toLowerCase()) >= 0
      return filterMatch
    })
    .filter (product => {
      var showOnlyStocked = this.props.searchInterface.inStockOnly == false || product.stocked
      return showOnlyStocked
    })
    .reduce ((tuple, product, idx) =>{
      if (tuple.last.indexOf(product.category) < 0) {
        tuple.last.push(product.category)
        tuple.components.push( React.createElement(ProductCategoryRow, {key:product.category}) )
      }
       tuple.components.push( React.createElement(ProductRow, {product:product, key:idx}) )
       return tuple
     }, {last:Array<String>(), components:Array<React.ReactElement<any>>()})
     .components

    var d = React.DOM
    var table = d.table
    var head = d.thead
    var tr   = d.tr
    var th   = d.th
    var tbody = d.tbody

    return table(null,
      head(null,
        d.tr(null,
          d.th(null, "Name"),
          d.th(null, "Price")
        )
      ),
      tbody(null, components.map(component => { return component }))

    )



  }
}



interface SearchInterface {
  filterText?:string
  inStockOnly?:boolean
  handleUserInput?:(searchInterface:SearchInterface)  => void
}

class SearchBar extends React.Component<SearchInterface,any>{

  handleCheckbox = (e:React.SyntheticEvent) => {
    this.props.handleUserInput({inStockOnly:e.target["checked"]})
  }

  handleSearch = (e:React.SyntheticEvent) => {
    this.props.handleUserInput({filterText:e.target["value"]})
  }

  render = () => {

    return React.DOM.form(null,
      React.DOM.input(
        {type:"text",
        placeholder : "Search...",
        value:this.props.filterText,
        onChange : this.handleSearch
        }),
      React.DOM.p(null,
        React.DOM.input(
          {type: "checkbox",
          checked:this.props.inStockOnly,
          onChange : this.handleCheckbox
          }),
        ' ',
        "Only show products in stock"
      )
    )
  }
}

class FilterableProductTable extends React.Component<Array<Product>,SearchInterface>{

  constructor(props?: Array<Product>, context?: any) {
    super(props, context)
    this.state = {filterText:'', inStockOnly : false, handleUserInput : this.handleUserInput}
  }

  handleUserInput = (searchInterface:SearchInterface) => {
    this.setState(searchInterface)
  }

  render = () =>   {
    return React.DOM.div(null,
        React.createElement(SearchBar,this.state),
        React.createElement(ProductTable,{products:this.props, searchInterface : this.state})
    )
  }
}




class Searching extends React.Component<any,{saut:boolean}>{

  constructor(props?: any, context?: any) {
    super()
    this.state = {saut:false}

  }

  handleCheckbox = (e:React.SyntheticEvent) =>  {
    var previous = !this.state.saut
    this.setState({saut: previous}); //works
  }

  handleSearch = (e:React.SyntheticEvent) => {

  }

  render = () => {

    return React.DOM.form(null,
      React.DOM.input(
        {type:"text",
        placeholder : "Search...",
        value:"this.props.filterText",
        onChange : this.handleSearch
        }),
      React.DOM.p(null,
        React.DOM.input(
          {type: "checkbox",
          checked: this.state.saut,
          onChange : this.handleCheckbox
          }),
        ' ',
        "Only show products in stock"
      )
    )
  }
}

function run() {

  // React.render(React.createElement(Searching), document.getElementById('container'))
  React.render(React.createElement(FilterableProductTable, products), document.body);

}

if (window.addEventListener) {
  window.addEventListener('DOMContentLoaded', run);
}
