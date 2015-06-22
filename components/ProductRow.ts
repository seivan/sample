//
// /// <reference path="Product.ts" />
//
// import React = require("react")
//
// class ProductRow extends React.Component<Product,any>
// implements React.ComponentSpec<Product,any> {
//     render() {
//
//       var name = this.props.stocked ?
//                 this.props.name :
//                 React.DOM.span({style: {color: 'red'}}, this.props.name)
//
//
//       return React.DOM.tr({key:this.props.name},
//               React.DOM.td(null, name),
//               React.DOM.td(null, this.props.price)
//       )
//     }
// }
