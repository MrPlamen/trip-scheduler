import { useEffect, useState } from "react";
import request from "../utils/request";

const baseUrl = `http://localhost:3030/jsonstore/visitItems`;

export const useSearchVisitItem = (memberEmail) => {
    const [filteredItems, setFilteredItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItemsByMember = async () => {
            try {
                // Fetch all items
                const items = await request.get(baseUrl);
                
                // Convert items object to an array of item objects
                const itemsArray = Object.values(items);
                
                // Filter items where memberEmail exists in the members array
                const itemsWithMember = itemsArray.filter(item =>
                    item.members && item.members.includes(memberEmail) // Adjust the condition based on how members are stored
                );
                
                // Set the filtered items to state
                setFilteredItems(itemsWithMember);
            } catch (error) {
                setError("Failed to fetch items.");
                console.error("Error fetching items:", error);
            }
        };

        if (memberEmail) {
            fetchItemsByMember();
        }
    }, [memberEmail]); // Re-run when memberEmail changes

    return { filteredItems, error };
};
