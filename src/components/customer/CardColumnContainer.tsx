import React, { Component } from "react";
import RoundedCard from "./RoundedCard";

export default class CardColumnContainer extends Component {
  constructor(props: any, cardsArray: any) {
    super(props);
    // @ts-ignore
    this.cardsArray = cardsArray;
  }

  getFront() {
    // @ts-ignore
    return <RoundedCard cardInfo={this.cardsArray[0]} />;
  }

  getMiddle() {
    // @ts-ignore
    return <RoundedCard cardInfo={this.cardsArray[1]} />;
  }

  getFurthest() {
    // @ts-ignore
    return <RoundedCard cardInfo={this.cardsArray[2]} />;
  }

  arrayMove(array: any[], oldIndex: any, newIndex: any) {
    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
  }
}
