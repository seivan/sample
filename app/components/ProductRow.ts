/// <reference path="../typings/tsd.d.ts"/>
import React = require("react")

import Product = require("./Product");

class ProductRow extends React.Component<{product:Product},any> {

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

export = ProductRow
