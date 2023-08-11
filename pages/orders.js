import {useEffect, useState} from "react";
import axios from "axios";

import Layout from "@/components/Layout";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    useEffect(()=>{
        axios.get('/api/orders').then(response=>{
            setOrders(response.data);
        })
    },[])
    return (
        <Layout>
            <h1>Orders</h1>
            <table className="basic">
                <thead>
                <tr>
                    <td>Date</td>
                    <td>Paid</td>
                    <td>Recipient</td>
                    <td>Products</td>
                </tr>
                </thead>
                <tbody>
                {orders.length>0 && orders.map((order, index) =>(
                    <tr key={index}>
                        <td>{new Date(order.createdAt).toLocaleString()}</td>
                        <td>
                            {order.paid?
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-600">
                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                </svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                                </svg>

                            }
                        </td>
                        <td>
                            {order.name} {order.name} <br/>
                            {order.city} {order.postalCode} <br/>
                            {order.country} <br/>
                            {order.streetAddress}
                        </td>
                        <td>
                            {order.line_items.map(item=>(
                                <>
                                    {item.price_data?.product_data.name} x {item.quantity} <br/>
                                </>
                            ))}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </Layout>
    )
}

export default OrdersPage


