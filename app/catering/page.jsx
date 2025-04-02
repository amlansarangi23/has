"use client";
import { addCatering } from "@/lib/api";
import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import Image from "next/image";

const CateringPage = () => {
  const [tokenNumber, setTokenNumber] = useState("");
  const [cateringItems, setCateringItems] = useState([
    { item_name: "", quantity: 1, price: 0 },
  ]);
  const [message, setMessage] = useState("");

  const handleCateringChange = (index, e) => {
    const updatedCateringItems = [...cateringItems];
    updatedCateringItems[index][e.target.name] = e.target.value;
    setCateringItems(updatedCateringItems);
  };

  const handleAddCateringItem = () => {
    setCateringItems([
      ...cateringItems,
      { item_name: "", quantity: 1, price: 0 },
    ]);
  };

  const handleSubmitCatering = async () => {
    const data = {
      token_number: tokenNumber,
      items: cateringItems,
    };
    const result = await addCatering(data);
    setMessage(result.message);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Add Catering
        </h1>

        <div className="mb-6">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="tokenNumber"
          >
            Token Number
          </label>
          <input
            type="text"
            id="tokenNumber"
            placeholder="Enter Token Number"
            value={tokenNumber}
            onChange={(e) => setTokenNumber(e.target.value)}
            className="p-4 w-full rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">
          Catering Items
        </h2>

        {cateringItems.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
          >
            <div>
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor={`item_name_${index}`}
              >
                Item Name
              </label>
              <input
                type="text"
                id={`item_name_${index}`}
                name="item_name"
                value={item.item_name}
                placeholder="Item Name"
                onChange={(e) => handleCateringChange(index, e)}
                className="p-4 w-full rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor={`quantity_${index}`}
              >
                Quantity
              </label>
              <input
                type="number"
                id={`quantity_${index}`}
                name="quantity"
                value={item.quantity}
                placeholder="Quantity"
                onChange={(e) => handleCateringChange(index, e)}
                className="p-4 w-full rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor={`price_${index}`}
              >
                Price
              </label>
              <input
                type="number"
                id={`price_${index}`}
                name="price"
                value={item.price}
                placeholder="Price"
                onChange={(e) => handleCateringChange(index, e)}
                className="p-4 w-full rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        ))}

        <div className="flex justify-between mb-6">
          <button
            onClick={handleAddCateringItem}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
          >
            Add Another Item
          </button>
          <button
            onClick={handleSubmitCatering}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none"
          >
            Submit Catering
          </button>
        </div>

        {message && <p className="text-center text-red-500">{message}</p>}
      </div>

      {/* Carousel for Menu Pages */}
      <div className="mt-12 w-1/2 mx-auto">
        <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">
          Menu Pages
        </h2>

        <Carousel
          showThumbs={false}
          infiniteLoop
          autoPlay
          interval={3000}
          transitionTime={500}
          className="rounded-lg shadow-lg"
        >
          <div>
            <Image
              src="/menuimg1.jpg"
              alt="Menu Page 1"
              width={500}
              height={300}
            />

            <p className="legend">Menu Page 1</p>
          </div>
          <div>
            <Image
              src="/menuimg2.jpg"
              alt="Menu Page 1"
              width={500}
              height={300}
            />

            <p className="legend">Menu Page 2</p>
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default CateringPage;
