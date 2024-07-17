﻿import React, { useState, useEffect } from 'react';
import './Shop.css';
import Dashboard from './Dashboard';
import { useNavigate } from 'react-router-dom';

const CommentsRatings = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [availableQuantities, setAvailableQuantities] = useState({});
    const [products, setProducts] = useState([]);
    const [comments, setComments] = useState({});
    const [ratings, setRatings] = useState({});
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(1); // Default rating value
    const [highestCommentId, setHighestCommentId] = useState(0);
    const [highestRatingId, setHighestRatingId] = useState(0);

    useEffect(() => {
        const fetchAllShoes = async () => {
            try {
                const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:1184' : 'http://inventoryapi';

                const allShoesResponse = await fetch(`${baseUrl}/Inventory`);
                if (!allShoesResponse.ok) {
                    console.error('Failed to fetch all shoes:', allShoesResponse.statusText);
                    const errorText = await allShoesResponse.text();
                    console.error('Response text:', errorText);
                    setErrorMessage('Failed to fetch shoes. See console for details.');
                    return;
                }
                const allShoesData = await allShoesResponse.json();

                if (allShoesData.length > 0) {
                    const filteredShoes = allShoesData.filter((shoe) => shoe.id >= 3);
                    setProducts(filteredShoes);

                    const commentsData = {};
                    const ratingsData = {};
                    let highestComment = 0;
                    let highestRating = 0;

                    for (const shoe of filteredShoes) {
                        const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:1185' : 'http://commentsratings';
                        
                        const commentsResponse = await fetch(`${baseUrl}/CommentsRatings/comments/${shoe.id}`);
                        const commentsJson = await commentsResponse.json();
                        commentsData[shoe.id] = commentsJson;

                        commentsJson.forEach(comment => {
                            const commentId = parseInt(comment.id, 10);
                            highestComment = Math.max(highestComment, commentId);
                        });

                        const ratingsResponse = await fetch(`${baseUrl}/CommentsRatings/ratings/${shoe.id}`);
                        const ratingsJson = await ratingsResponse.json();
                        ratingsData[shoe.id] = ratingsJson;

                        ratingsJson.forEach(rating => {
                            const ratingId = parseInt(rating.id, 10);
                            highestRating = Math.max(highestRating, ratingId);
                        });
                    }

                    setComments(commentsData);
                    setRatings(ratingsData);

                    setHighestCommentId(highestComment);
                    setHighestRatingId(highestRating);

                    const quantities = {};
                    filteredShoes.forEach((shoe) => {
                        quantities[shoe.id] = shoe.quantity;
                    });
                    setAvailableQuantities(quantities);
                }
            } catch (error) {
                console.error('Failed to fetch shoes:', error.message);
                setErrorMessage('Failed to fetch shoes. See console for details.');
            }
        };

        fetchAllShoes();
    }, []);

    const handleCommentSubmit = async (productId) => {
        try {
            const requestBody = JSON.stringify({
                id: (highestCommentId + 1).toString(),
                itemId: productId,
                userId: localStorage.getItem('userId'),
                content: newComment,
                timestamp: new Date().toISOString(),
            });

            const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:1185' : 'http://commentsratings';

            const response = await fetch(`${baseUrl}/CommentsRatings/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
            });

            console.log('Request Body:', requestBody);

            if (response.ok) {
                setNewComment('');
                setHighestCommentId(highestCommentId + 1);
                const commentsResponse = await fetch(`${baseUrl}/CommentsRatings/comments/${productId}`);
                const commentsJson = await commentsResponse.json();
                setComments((prevComments) => ({ ...prevComments, [productId]: commentsJson }));
            } else {
                console.error('Failed to submit comment:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to submit comment:', error.message);
        }
    };

    const handleCommentDelete = async (productId, commentId) => {
        try {
            const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:1185' : 'http://commentsratings';

            const response = await fetch(`${baseUrl}/CommentsRatings/comments/${commentId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const commentsResponse = await fetch(`${baseUrl}/CommentsRatings/comments/${productId}`);
                const commentsJson = await commentsResponse.json();
                setComments((prevComments) => ({ ...prevComments, [productId]: commentsJson }));
            } else {
                console.error('Failed to delete comment:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to delete comment:', error.message);
        }
    };

    const handleRatingSubmit = async (productId) => {
        try {
            const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:1185' : 'http://commentsratings';

            const response = await fetch(`${baseUrl}/CommentsRatings/ratings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: (highestRatingId + 1).toString(),
                    itemId: productId,
                    userId: localStorage.getItem('userId'),
                    value: newRating,
                    timestamp: new Date().toISOString(),
                }),
            });

            if (response.ok) {
                const ratingsResponse = await fetch(`${baseUrl}/CommentsRatings/ratings/${productId}`);
                setHighestRatingId(highestRatingId + 1);
                const ratingsJson = await ratingsResponse.json();
                setRatings((prevRatings) => ({ ...prevRatings, [productId]: ratingsJson }));
            } else {
                console.error('Failed to submit rating:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to submit rating:', error.message);
        }
    };

    const handleRatingDelete = async (productId, ratingId) => {
        try {
            const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:1185' : 'http://commentsratings';

            const response = await fetch(`${baseUrl}/CommentsRatings/ratings/${ratingId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const ratingsResponse = await fetch(`${baseUrl}/CommentsRatings/ratings/${productId}`);
                const ratingsJson = await ratingsResponse.json();
                setRatings((prevRatings) => ({ ...prevRatings, [productId]: ratingsJson }));
            } else {
                console.error('Failed to delete rating:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to delete rating:', error.message);
        }
    };

    const calculateAverageRating = (productId) => {
        const ratingsArray = ratings[productId] || [];
        const totalRating = ratingsArray.reduce((sum, rating) => sum + rating.value, 0);
        const averageRating = totalRating / ratingsArray.length || 0;
        return averageRating.toFixed(2);
    };

    return (
        <div className="Shop">
            <Dashboard />
            <div className="catalog">
                <h2>Product Catalog</h2>
                {products.map((product) => (
                    <div key={product.id} className="list">
                        <div className="card">
                            <p>{product.name} - ${product.price}</p>
                            <p>Amount Left: {availableQuantities[product.id]}</p>

                            <div>
                                <h3>Comments:</h3>
                                {comments[product.id]?.map((comment) => (
                                    <div key={comment.id}>
                                        <p>{comment.content}</p>
                                        <button onClick={() => handleCommentDelete(product.id, comment.id)}>Delete</button>
                                    </div>
                                ))}
                                <textarea
                                    placeholder="Add/Edit Comment"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <button onClick={() => handleCommentSubmit(product.id)}>Comment</button>
                            </div>

                            <div>
                                <h3>Rating: {calculateAverageRating(product.id)}</h3>
                                <select
                                    value={newRating}
                                    onChange={(e) => setNewRating(Number(e.target.value))}
                                >
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <option key={value} value={value}>{value}</option>
                                    ))}
                                </select>
                                <button onClick={() => handleRatingSubmit(product.id)}>Rate</button>
                                <button onClick={() => handleRatingDelete(product.id, ratings[product.id]?.[0]?.id)}>Delete Rating</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentsRatings;