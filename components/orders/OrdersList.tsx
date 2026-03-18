
// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";

// type Product = {
//   id: number;
//   name: string;
//   image: string;
// };

// type Item = {
//   id: number;
//   quantity: number;
//   price_at_order: string;
//   product: Product;
// };

// type Order = {
//   id: number;
//   order_date: string;
//   status: string;
//   total_amount: string;
//   currency: string;
//   items: Item[];
// };

// export default function OrdersList() {

//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);

//   const getCookie = (name: string) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) {
//       return parts.pop()?.split(";").shift();
//     }
//     return null;
//   };

//   useEffect(() => {

//     const fetchOrders = async () => {

//       try {

//         const token = getCookie("token");

//         const res = await fetch(
//           "https://medicaps.cloud/grasa/shop/orders",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = await res.json();

//         setOrders(data);

//         localStorage.setItem("orders", JSON.stringify(data));

//       } catch (error) {
//         console.error("Orders fetch error:", error);
//       } finally {
//         setLoading(false);
//       }

//     };

//     fetchOrders();

//   }, []);

//   if (loading) {
//     return (
//       <div className="text-center py-10 text-gray-500">
//         Loading orders...
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">

//       {orders.map((order) => {

//         const item = order.items[0];

//         return (

//           <Link
//             key={order.id}
//             href={`/shop/orders/${order.id}`}
//           >

//             <div className="bg-white rounded-xl m-4 shadow-sm hover:shadow-md transition flex items-center gap-8 p-2 cursor-pointer">

//               {/* Product Image */}
//               <img
//                 src={item.product.image}
//                 alt={item.product.name}
//                 className="w-30 h-30 rounded-lg object-cover"
//               />

//               {/* Content */}
//               <div className="flex-1">

//                 {/* Title */}
//                 <h3 className="font-semibold text-gray-800 text-lg leading-tight">
//                   {item.product.name}
//                 </h3>

//                 {/* Subtitle */}
//                 <p className="text-gray-500 text-sm mt-1">
//                   {item.quantity} Item • ₹{item.price_at_order}
//                 </p>

//                 {/* Status */}
//                 <p className="text-xs text-green-600 mt-1 font-medium">
//                   {order.status}
//                 </p>

//               </div>

//               {/* Date */}
//               <div className="text-sm text-gray-400 whitespace-nowrap">
//                 {new Date(order.order_date).toLocaleDateString()}
//               </div>

//             </div>

//           </Link>

//         );

//       })}

//     </div>
//   );
// }





"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  image: string;
};

type Item = {
  id: number;
  quantity: number;
  price_at_order: string;
  product: Product;
};

type Order = {
  id: number;
  order_date: string;
  status: string;
  total_amount: string;
  currency: string;
  items: Item[];
};

export default function OrdersList() {

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift();
    }
    return null;
  };

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const token = getCookie("token");

        const res = await fetch(
          "https://medicaps.cloud/grasa/shop/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        setOrders(data);

        localStorage.setItem("orders", JSON.stringify(data));

      } catch (error) {
        console.error("Orders fetch error:", error);
      } finally {
        setLoading(false);
      }

    };

    fetchOrders();

  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading orders...
      </div>
    );
  }

  return (

    // <div className="max-w-6xl mx-auto space-y-4 px-3  lg:px-0">
    <div className="w-full px-2 sm:px-4 lg:px-0">

      {orders.map((order) => {

        const item = order.items[0];

        return (

          <Link
            key={order.id}
            href={`/shop/orders/${order.id}`}
          >

            <div className="bg-white rounded-xl shadow-sm my-6 hover:shadow-md transition cursor-pointer p-3 ">

              <div className="flex items-center gap-3 ">

                {/* Product Image Card */}

                <div className="bg-gray-100 rounded-lg p-1 sm:p-2 flex-shrink-0">

                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover rounded-md"
                  />

                </div>

                {/* Content */}

                <div className="flex-1 min-w-0">

                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base lg:text-lg leading-tight truncate">
                    {item.product.name}
                  </h3>

                  <p className="text-gray-500 text-xs sm:text-sm mt-1">
                    {item.quantity} Item • ₹{item.price_at_order}
                  </p>

                  <p className="text-xs text-green-600 mt-1 font-medium">
                    {order.status}
                  </p>

                </div>

                {/* Date */}

                <div className="text-xs sm:text-sm text-gray-400 whitespace-nowrap text-right">
                  {new Date(order.order_date).toLocaleDateString()}
                </div>

              </div>

            </div>

          </Link>

        );

      })}

    </div>

  );
}