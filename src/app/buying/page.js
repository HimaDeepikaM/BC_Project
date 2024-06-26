"use client"
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../../../utils/constants';

const MarketplaceDisplay = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, contractABI, provider);
            const items = await contract.getAllItems();
            console.log(items);
            const itemsFormatted = items.map(item => ({
                id: item.id.toNumber(),
                title: item.title,
                imageHash: item.imageHash,
                price: ethers.utils.formatEther(item.price),
                sold: item.sold,
                description: item.description
            }));
            setItems(itemsFormatted);
         };

        fetchItems();
    }, []);
    
    const handleCardClick = (item) => {
        if (!item.sold) {
            // Using window.location for simplicity; replace with your router's navigation logic if using React Router, Next.js, etc.
            console.log(item?.price);
            window.location.href = `/item_details?title=${encodeURIComponent(item.title)}&imageHash=${encodeURIComponent(item.imageHash)}&price=${encodeURIComponent(item.price)}&sold=${item.sold}&description=${encodeURIComponent(item.description)}&id=${item.id}`;
        }
    };

    return (
        <div className="bg-gray-800 min-h-screen p-6">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">Items in Marketplace</h1>
                <div className="grid grid-cols-3 gap-4">
                    {items.map((item) => (
                        <div key={item.id} 
                             className={`relative bg-white rounded-lg shadow-lg p-4 ${item.sold ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}`}
                             onClick={() => handleCardClick(item)}>
                            <img src={`https://gateway.pinata.cloud/ipfs/${item.imageHash}`} alt={item.title} className="rounded w-full h-64 object-cover" />
                            <h5 className="text-gray-900 text-xl leading-tight font-bold mt-2">{item.title}</h5>
                            <p className="text-gray-600">{item.price}</p>
                            {item.sold && <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center font-bold text-white text-xl" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>Sold Out</div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MarketplaceDisplay;

