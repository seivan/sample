/// <reference path="../typings/tsd.d.ts"/>

import Rx = require("rx")


// import Lazy = require("lazy.js")
import React = require("react")
import Product = require("./Product");
import ProductRow = require("./ProductRow");
declare var EventSource : sse.IEventSourceStatic;

declare module sse {

    enum ReadyState {CONNECTING = 0, OPEN = 1, CLOSED = 2}

    interface IEventSourceStatic extends EventTarget {
        new (url: string, eventSourceInitDict?: IEventSourceInit): IEventSourceStatic;
        url: string;
        withCredentials: boolean;
        CONNECTING: ReadyState; // constant, always 0
        OPEN: ReadyState; // constant, always 1
        CLOSED: ReadyState; // constant, always 2
        readyState: ReadyState;
        onopen: Function;
        onmessage: (event: IOnMessageEvent) => void;
        onerror: Function;
        close: () => void;
    }

    interface IEventSourceInit {
        withCredentials?: boolean;
    }

    interface IOnMessageEvent {
        data: string;
    }
}




var products = [
  new Product('Sporting Goods', '$49.99',  true, 'Football'),
  new Product('Sporting Goods', '$9.99', true,  'Baseball'),
  new Product('Sporting Goods', '$29.99',  false,  'Basketball'),
  new Product('Electronics', '$99.99',  true,  'iPod Touch'),
  new Product('Electronics',  '$399.99',  false,  'iPhone 5'),
  new Product('Electronics',  '$199.99',  true,  'Nexus 7')
]

var copy = JSON.stringify(products[0])

for (let i = 0; i < 1000; i++) {
    products.push(JSON.parse(copy))
  }

//products = [new Product('Sporting Goods', '$49.99',  true, 'Football')]


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
    var components:any; //Array<React.ReactElement<any>>

    var products:Array<Product> = []
    for (var x in this.props.products) {
      products.push(this.props.products[x])
    }



    // var lazyProducts = products//Lazy(products)

    // var shit =  Rx.Observable.fromArray(lazyProducts)

    var lazyProducts = Rx.Observable.fromArray(products)
    var search = Rx.Observable.from(this.props.searchInterface)

    var zoom = lazyProducts.reduce((first, second) => {
           return first
         }, 5)


    lazyProducts
    .filter (product => {
      var filterMatch = product.name.toLowerCase().indexOf(this.props.searchInterface.filterText.toLowerCase()) >= 0
      return filterMatch
    })
    .filter (product => {
      var showOnlyStocked = this.props.searchInterface.inStockOnly == false || product.stocked
      return showOnlyStocked
    })
    .reduce ((tuple, product) =>{
      if (tuple.last.indexOf(product.category) < 0) {
        tuple.last.push(product.category)
        tuple.components.push( React.createElement(ProductCategoryRow, {key:product.category}) )
      }
       tuple.components.push( React.createElement(ProductRow, {product:product, key:products.indexOf(product)}) )
       return tuple
     }, {last:Array<String>(), components:Array<React.ReactElement<any>>()})
     .map ((x:any) => {

        return x["components"]
     })
     .subscribe ((x:any) => {
       components = x
     }).dispose()

     console.log(components)


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
      tbody(null, components)

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




 var source = new EventSource('http://localhost:3000/messages/')

 source.onerror = () => {
   console.log("FAILED")
 };

source.addEventListener("stream.create", (e) =>  {
  console.log("create")
  console.log(e)

})

source.addEventListener("stream.update", (e) =>  {
  console.log("update")
  console.log(e)
  // source.close()

})

function run() {

  // React.render(React.createElement(Searching), document.getElementById('container'))
  React.render(React.createElement(FilterableProductTable, products), document.body);

}

if (window.addEventListener) {
  window.addEventListener('DOMContentLoaded', run);
}
