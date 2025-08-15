import React from "react";
import { useEffect } from "react";
const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="flex flex-col items-center pt-24 ">
      <div className="w-[330px] h-[400px] max-w-4xl md:w-[800px] md:h-[450px] relative">
        <iframe
          src="https://www.google.com/maps/d/u/0/embed?mid=1pkk7xSUa9sO4SDzTKI2B-XwENeCXwz8&ehbc=2E312F&noprof=1"
          width="100%"
          height="100%"
          frameborder="0"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-lg"
        ></iframe>
        <div className="absolute flex flex-row justify-center top-0 w-full h-[60px] bg-white z-10">
          <h1 className="items-center text-2xl font-semibold">Contact</h1>
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-center text-center mb-11">
        <h1 className="text-medium font-semibold mt-2">
          Flagship Store Inquiry
        </h1>
        <p className="text-xs">
          Address: 42 Longhorn Ave., Brgy. Valencia, Quezon City, Metro Manila,
          Philippines
        </p>
        <p className="text-xs">Contact No.: (+63) 927.684.1234</p>
        <h1 className="mt-2 text-medium font-semibold">Online Transaction</h1>
        <p className="text-xs">(+63) 935.748.6210 / (02) 874-5623</p>
        <h1 className="text-medium font-semibold mt-2">
          Social Media Accounts
        </h1>
        <p className="text-xs">Twitter: @OutfithavenPH</p>
        <p className="text-xs">Instagram: @Outfithaven</p>
      </div>
    </div>
  );
};

export default Contact;
