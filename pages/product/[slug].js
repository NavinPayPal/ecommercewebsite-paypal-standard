import React, { useState } from 'react'
import { client, urlFor } from '../../lib/client'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'
import {CgShoppingCart} from 'react-icons/cg'
import { useStateContext } from '../../context/StateContext';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

const ProductDetails = ({products, product}) => {
    const { image, name, details, price, tags, care } = product;
    const [index, setIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const {decQty, incQty, qty, onAdd} = useStateContext();
    const [addedToCart, setAddedToCart] = useState(false);
    const router = useRouter();

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error('Please select a size');
            return;
        }
        onAdd(product, qty, selectedSize, tags);
        setAddedToCart(true);
    }

    const handleQuantityChange = (type) => {
        if (type === 'inc') {
            incQty();
        } else {
            decQty();
        }
        if (addedToCart) {
            setAddedToCart(false);
        }
    }

    const careList = [];

    {for (let i = 0; i < care.length; i++) {
        careList.push(care[i].children[0].text)
    }}

    return (
        <div className='products'>
            <div className='product-detail-container'>
                <div className='product-images'>
                    <div className='small-images-container'>
                        {image?.map((item, ind) => (
                            <img 
                            key={ind}
                            src={urlFor(item)} 
                            className='small-image' 
                            onMouseEnter={() => setIndex(ind)} />
                        ))}
                    </div>
                    <div className='big-image-container'>
                        <img src={urlFor(image && image[index])} />
                    </div>
                </div>
                <div className='product-details'>
                    <div className='name-and-category'>
                        <h3>{name}</h3>
                        <span>{tags}</span>   
                    </div>
                    <div className='size'>
                        <p>SELECT SIZE</p>
                        <ul>
                            {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                                <li key={size}
                                    className={selectedSize === size ? 'selected' : ''}
                                    onClick={() => setSelectedSize(size)}>
                                    {size}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='quantity-desc'>
                        <h4>Quantity: </h4>
                        <div>
                            {/* <span className='minus' onClick={decQty}><AiOutlineMinus /></span>
                            <span className='num' onClick=''>{qty}</span>
                            <span className='plus' onClick={incQty}><AiOutlinePlus /></span> */}
                            <span className='minus' onClick={() => handleQuantityChange('dec')}><AiOutlineMinus /></span>
                            <span className='num' onClick=''>{qty}</span>
                            <span className='plus' onClick={() => handleQuantityChange('inc')}><AiOutlinePlus /></span>
                        </div>
                    </div>
                    <div className='add-to-cart'>
                        {addedToCart ? (
                        <button className='btn' type='button' onClick={() => router.push('/cart')}><CgShoppingCart size={20} />View my cart</button>
                        ) : 
                        <button className='btn' type='button' onClick={handleAddToCart}><CgShoppingCart size={20} />Add to Cart</button>
                        }

                        <p className='price'>${price}.00</p>
                    </div>
                </div>
            </div>

            <div className='product-desc-container'>
                <div className='desc-title'>
                    <div className="desc-background">
                        Overview
                    </div>
                    <h2>Product Information</h2>  
                </div>
                <div className='desc-details'>
                    <h4>PRODUCT DETAILS</h4>
                    <p>{details[0].children[0].text}</p>  
                </div>
                <div className='desc-care'>
                    <h4>PRODUCT CARE</h4>
                    <ul>
                    {careList.map(list => (
                        <li>{list}</li>
                    ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default ProductDetails

export const getStaticProps = async ({params: {slug}}) => {
    const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
    const productsQuery = '*[_type == "product"]'
    const product = await client.fetch(query);
    const products = await client.fetch(productsQuery)
  
    return {
      props: { products, product }
    }
}

// Generates `/product/1` and `/product/2`
export const getStaticPaths = async () => {
    const query = `*[_type == "product"] {
        slug {
            current
        }
    }`;

    const products = await client.fetch(query);

    const paths = products.map((product) => ({
        params: {
            slug: product.slug.current
        }
    }));

    return {
      paths,
      fallback: 'blocking'
    }
}
