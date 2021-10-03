import Item from '@element/horizontalItem'
import React from 'react'

function ProductsWithCategory({ categories }) {
    return (
        <div className="products-category-wrap">
            {categories.map((category: any, catIndex: number) => {
                return <div className="cat-item-wrap" key={catIndex}>
                    {category.type == 'product' && category.showOnUi ? <>
                        <div className="cat-wrap clearfix">
                            <div className="cat-name">{category.name}</div>
                            {category.hasSubcategory ? <div>
                                {category?.categoryList?.map((category, subCatIndex) => {
                                    return <div key={subCatIndex} className="product-list-outer">
                                        <div className="list-block">
                                            <div className="ser-list-title">{category.name}</div>
                                            {category?.itemList?.map((item, itemIndex) => {
                                                const catUrl = category.name.toLowerCase().split(" ").join("-") + '-prp/';
                                                const itemUrl = catUrl + item.name.toLowerCase().split(" ").join("-") + '-pdp';
                                                item.category = category.name;
                                                item.catUrl = catUrl;
                                                item.itemUrl = itemUrl;
                                                return <div key={itemIndex}>
                                                    <Item item={item} config={{ redirection: false, onClickAction: true }} />
                                                </div>
                                            })}
                                        </div>
                                    </div>
                                })}
                            </div> :
                                <div className="fullwidth horizontal-product-card-wrap">
                                    {category?.itemList?.map((item, itemIndex) => {
                                        const catUrl = category.name.toLowerCase().split(" ").join("-") + '-prp/';
                                        const itemUrl = catUrl + item.name.toLowerCase().split(" ").join("-") + '-pdp';
                                        item.category = category.name;
                                        item.catUrl = catUrl;
                                        item.itemUrl = itemUrl;
                                        return <div key={itemIndex} className="product-list-outer">
                                            <Item item={item} config={{ redirection: false, onClickAction: true }} />
                                        </div>
                                    })
                                    }
                                </div>
                            }
                        </div>
                    </>
                        : null}
                </div>
            })}
        </div>
    )
}

export default ProductsWithCategory
