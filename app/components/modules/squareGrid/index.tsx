import React from 'react'
import SquareItem from "@element/squareItem";

function SquareGrid({ items, config, handleClick, noImage }) {
    return (
        <>
            {items ? items?.map((item, index) => {
                if (item.showOnUi) {
                    if (config.from != "all") {
                        if (!item.imagePath) item.imagePath = noImage;
                        if (item.imagePaths && item.imagePaths?.length !== 0) item.imagePath = item.imagePaths[0].imagePath || noImage;
                        if ('icon' in item) item.imagePath = item.icon || noImage;
                        return <SquareItem item={item} config={config} key={index} handleClick={handleClick} />
                    } else {
                        if (item.type == config.type) {
                            if (!item.imagePath) item.imagePath = noImage;
                            if (item.imagePaths && item.imagePaths?.length !== 0) item.imagePath = item.imagePaths[0].imagePath || noImage;
                            if ('icon' in item) item.imagePath = item.icon || noImage;
                            return <SquareItem item={item} config={config} key={index} handleClick={handleClick} />
                        }
                    }
                }
            }) :
                null
            }
        </>
    )
}

export default SquareGrid;
