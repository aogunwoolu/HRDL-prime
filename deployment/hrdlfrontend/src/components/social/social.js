import React, { useState } from "react";
import Card from "./subcomponents/card";
import Cards from "./subcomponents/cards";
import { Carousel } from "react-bootstrap";

const API_PATH = `http://${window.location.hostname}:8000/`;

// data for the carousel
// will be social data in future iterations of HRDL
export const data = [
    {
      name: "post 1",
    },
    {
      name: "post 2",
    },
    {
      name: "post 3",
    },
    {
      name: "post 4",
    },
    {
        name: "post 5",
      },
      {
        name: "post 6",
      },
  ];

// social carousel component
const Social =(props)=> {
    // split chunks of data for carousel
    function splitArrayIntoChunksOfLen(arr, len): Array {
        var chunks = [], i = 0, n = arr.length;
        while (i < n) {
            chunks.push(arr.slice(i, i += len));
        }
        return chunks;
    }

    return (
        <div className="social-carousel">
            <Carousel
                nextLabel={null}
                prevLabel={null}
                wrap={false}
                fade={true}
            >
                {
                    // return chunked array of cards, passing
                    // data to each card
                    splitArrayIntoChunksOfLen(data, 4).map((SA, i) => {
                        const cards = SA.map((itm, i) => {
                            return <Card {...itm}/>
                        })

                        return (
                            <Carousel.Item>
                                <Cards cards={
                                    cards
                                }/>
                            </Carousel.Item>
                        )
                    })
                }
            </Carousel>
        </div>
    )
}

export {Social}