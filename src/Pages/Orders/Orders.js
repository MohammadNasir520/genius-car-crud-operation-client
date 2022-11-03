import { data } from "autoprefixer";
import React, { useContext, useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider/AuthProvider";
import OrderRow from "./OrderRow";

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/orders?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, [user?.email]);


  const handleDelete=id=>{
    const procede= window.confirm('are you sure, you want to cancle this order')
    if(procede){
      fetch(`http://localhost:5000/orders/${id}`,{
          method: 'DELETE'
      })
      .then(res=>res.json())
      .then(data=>{
          console.log(data)
          if(data.deletedCount>0){
              alert("orders deleted succesFully");
              const remaining= orders.filter(order=>order._id !==id);
              setOrders(remaining)
          }
      })
    }
  
    }



    // handle status update of PATCH
    const handleStatusUpdate=id=>{
           fetch(`http://localhost:5000/orders/${id}`, {
            method : 'PATCH',
            headers:{
               'content-type': 'application/json'
            },
            body: JSON.stringify({status:'Approved'})
           })
           .then(res=>res.json())
           .then(data=>{
            console.log(data)
            if(data.modifiedCount){
                const remaining=orders.filter(order=>order._id !==id);
                const approving=orders.find(order=>order._id ===id)
                approving.status='Approved'
                const newOrders=[approving, ...remaining,];
                setOrders(newOrders)
            }
            
           })
    }

  return (
    <div>
      <h2 className="text-5xl"> You have {orders.length} Orders</h2>

      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Name</th>
              <th>Job</th>
              <th>Favorite Color</th>
              <th>message</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderRow

               key={order._id} 
               order={order}
               handleDelete={handleDelete}
               handleStatusUpdate={handleStatusUpdate}
               ></OrderRow>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
