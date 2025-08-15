import React from "react";
import { useEffect } from "react";

const HowToOrder = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="flex flex-col justify-center pt-24 px-7 md:px-28">
      <h1 className="text-2xl font-bold text-gray-800 mb-1 text-center">
        How To Order
      </h1>
      <div
        className=" h-[300px] md:w-full md:h-[110vh] bg-no-repeat bg-center bg-contain"
        style={{ backgroundImage: `url("images/hto.png")` }}
      ></div>
      <div className="flex flex-col mb-0 xl:px-64 md:mt-3">
        <h1 className="text-[9px] md:text-sm">
          ONLINE SHOP (www.outfithaven.com)
        </h1>
        <ul className="list-disc marker:text-black text-[9px] md:text-xs mt-2">
          <li className="ml-4">For nationwide and international order</li>
        </ul>
        <div className="mt-9 text-[9px] md:text-xs">
          <h1 className="text-[9px] md:text-xs mb-4 font-medium">
            Instructions:
          </h1>
          <div className="flex flex-col gap-3 font-medium">
            <p>
              - Go to SHOP section to browse all the products available at our
              online shop
            </p>
            <p>- ADD TO CART the product/s that you wish to buy</p>
            <p>
              - If you are satisfied with your order/s and wish to check out,
              just click the shopping bag icon and proceed to CHECKOUT
            </p>
            <p>
              - Input your email address and the necessary information needed on
              the SHIPPING ADDRESS section
            </p>
            <p>- Proceed to CONTINUE TO SHIPPING</p>
            <p>
              - For the payment, you have two options. You can pay using your
              Cash On Delivery or GCASH.
            </p>
            <p>- Click COMPLETE ORDER once you choose your mode of payment</p>
            <p>- Please take note of your order number.</p>
            <p>
              - You will receive updates regarding your order/s through email
            </p>
            If you have more questions and concerns, please don't hesitate to
            contact our Outfit Haven customer service. You may reach our
            customer service by sending us an email at outfithaven@gmail.com.
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToOrder;
