import React, {useState, useEffect} from 'react';
import Layout from "@/components/Layout";
import {useRouter} from "next/router";
import axios from "axios";

const DeleteProduct = () => {
    const router = useRouter();
    const {id} = router.query;
    const [product, setProduct] = useState();
    useEffect(() => {
        if (!id) return;
        axios.get('/api/products?id=' + id).then(response => {
            setProduct(response.data);
        })
    }, [id])
    const goBack = () => {
        router.push('/products');
    }
    const deleteProduct = async () => {
        await axios.delete('/api/products?id=' + id);
        goBack();
    }
    return (
        <Layout>
            {product && (
                <>
                    <h1 className='text-center'>
                        Do you really want to delete product &nbsp;&quot;{product?.title}&quot;?
                    </h1>
                    <div className="flex gap-2 justify-center">
                        <button
                            onClick={deleteProduct}
                            className='btn btn-red'
                        >
                            Yes
                        </button>
                        <button
                            onClick={goBack}
                            className='btn btn-default'
                        >
                            No
                        </button>
                    </div>
                </>
            )}
        </Layout>
    )
}

export default DeleteProduct


