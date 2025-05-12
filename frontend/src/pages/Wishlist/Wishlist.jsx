import React, { useState, useEffect } from 'react'
import ProfileImage from "../../assets/DefaultProfilePicture.jpg"
import axios from "axios"
import "./Wishlist.css"

function Wishlist() {
    const [loading, setLoading] = useState(false);
    const [partnerOneName, setPartnerOneName] = useState("Ayush")
    const [partnerTwoName, setPartnerTwoName] = useState("Merin")
    const [profileUrl, setProfileUrl] = useState("")
    const getCoupleSpace = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_DEVELOPMENT_URL}/api/v1/couples/couple-space`, {
                withCredentials: true,
            });
            setProfileUrl(response.data.data.coverPhoto);
            const name1 = response.data.data.partnerOneName.split(" ");
            setPartnerOneName(name1[0]);
            const name2 = response.data.data.partnerTwoName.split(" ");
            setPartnerTwoName(name2[0]);
        } catch (error) {
            console.error("Error fetching couple space data:", error);
        } finally {
            setLoading(false);
        }
    };




    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");

    // Fetch Todos
    const fetchTodos = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_DEVELOPMENT_URL}/api/v1/couples/getWish`, {
                withCredentials: true,
            });
            setTodos(response.data.data);
        } catch (error) {
            console.error("Error fetching todos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCoupleSpace();
        fetchTodos();
    }, []);

    // Add Todo
    const addTodo = async () => {
        if (newTodo.trim() === "") return;
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_DEVELOPMENT_URL}/api/v1/couples/addWish`,
                { item: newTodo },
                { withCredentials: true }
            );
            setTodos([...todos, response.data.data]); // Assuming response returns the new todo item
            setNewTodo("");
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    // Remove Todo
    const removeTodo = async (id) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_DEVELOPMENT_URL}/api/v1/couples/deleteWish`,
                { wishlistItemId: id },
                { withCredentials: true }
            );
            setTodos(todos.filter((todo) => todo._id !== id));
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    // Save Todo
    const saveTodo = async (id, newText) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_DEVELOPMENT_URL}/api/v1/couples/editWish`,
                { wishlistItemId: id, item: newText, status: "pending" }, // Defaulting to "pending" unless otherwise set
                { withCredentials: true }
            );
            setTodos(todos.map((todo) => (todo._id === id ? response.data.data : todo))); // Assuming response returns updated todo
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    };

    // Edit Todo
    const startEdit = (id) => {
        setTodos(todos.map((todo) =>
            todo._id === id ? { ...todo, isEditing: true } : todo
        ));
    };





    return (
        <div className="WishList">
            {loading ? (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            ) : (
                <>
                    <div className="TopImageContainerForCoupleSpace">
                        <div className="TopImageContainerForCoupleSpaceLeftPart">
                            <div className="TopImageContainerForCoupleSpaceLeftPartProfileCircle">
                                <img src={profileUrl || ProfileImage} alt="Profile" />
                            </div>
                        </div>
                        <div className="TopImageContainerForCoupleSpaceMiddlePart">
                            <div className="TopImageContainerForCoupleSpaceMiddlePartText">
                                <div className="TopImageContainerForCoupleSpaceMiddlePartTextTop">
                                    <h1>{partnerOneName}</h1>
                                    <div className='andInCoupleSpace'>&</div>
                                    <h1>{partnerTwoName}</h1>
                                </div>
                                <div className="TopImageContainerForCoupleSpaceMiddlePartTextBottom">
                                    <div className="SpaceInCoupleSpace">
                                        Space
                                    </div>
                                    <div className="TopImageContainerForCoupleSpaceRightPartBox HiddenBox">
                                        <div className="TopImageContainerForCoupleSpaceRightPartBoxContainer">
                                            <div className="TopImageContainerForCoupleSpaceRightPartBoxCircle">
                                            </div>
                                            <p>Text</p>
                                        </div>
                                        <div className="TopImageContainerForCoupleSpaceRightPartBoxContainer">
                                            <div className="TopImageContainerForCoupleSpaceRightPartBoxCircle">
                                            </div>
                                            <p>Text</p>
                                        </div>
                                        <div className="TopImageContainerForCoupleSpaceRightPartBoxContainer">
                                            <div className="TopImageContainerForCoupleSpaceRightPartBoxCircle">
                                            </div>
                                            <p>Text</p>
                                        </div>
                                        <div className="TopImageContainerForCoupleSpaceRightPartBoxContainer">
                                            <div className="TopImageContainerForCoupleSpaceRightPartBoxCircle">
                                            </div>
                                            <p>Text</p>
                                        </div>
                                        <div className="TopImageContainerForCoupleSpaceRightPartBoxContainer">
                                            <div className="TopImageContainerForCoupleSpaceRightPartBoxCircle">
                                            </div>
                                            <p>Text</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="TopImageContainerForCoupleSpaceRightPart">
                            <div className="TopImageContainerForCoupleSpaceRightPartBox">
                                <div className="TopImageContainerForCoupleSpaceRightPartBoxContainer">
                                    <div className="TopImageContainerForCoupleSpaceRightPartBoxCircle">
                                    </div>
                                    <p>Text</p>
                                </div>
                                <div className="TopImageContainerForCoupleSpaceRightPartBoxContainer">
                                    <div className="TopImageContainerForCoupleSpaceRightPartBoxCircle">
                                    </div>
                                    <p>Text</p>
                                </div>
                                <div className="TopImageContainerForCoupleSpaceRightPartBoxContainer">
                                    <div className="TopImageContainerForCoupleSpaceRightPartBoxCircle">
                                    </div>
                                    <p>Text</p>
                                </div>
                                <div className="TopImageContainerForCoupleSpaceRightPartBoxContainer">
                                    <div className="TopImageContainerForCoupleSpaceRightPartBoxCircle">
                                    </div>
                                    <p>Text</p>
                                </div>
                                <div className="TopImageContainerForCoupleSpaceRightPartBoxContainer">
                                    <div className="TopImageContainerForCoupleSpaceRightPartBoxCircle">
                                    </div>
                                    <p>Text</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="BucketList">
                        <h1>Bucket List</h1>

                        <ul>
                            {todos.map((todo) => (
                                <li key={todo._id} className="todoItem">
                                    {todo.isEditing ? (
                                        <input
                                            type="text"
                                            defaultValue={todo.item}
                                            onBlur={(e) => saveTodo(todo._id, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") saveTodo(todo._id, e.target.value);
                                            }}
                                            autoFocus
                                        />
                                    ) : (
                                        <span>{todo.item}</span>
                                    )}

                                    <div className="todoActions">
                                        {!todo.isEditing && (
                                            <button className="editButton" onClick={() => startEdit(todo._id)}>
                                                Edit
                                            </button>
                                        )}

                                        {todo.isEditing && (
                                            <button
                                                className="saveButton"
                                                onClick={(e) => {
                                                    const newText = e.target.closest("li").querySelector("input").value;
                                                    saveTodo(todo._id, newText);
                                                }}
                                            >
                                                Save
                                            </button>
                                        )}

                                        <button className="removeButton" onClick={() => removeTodo(todo._id)}>
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="addTodo">
                            <input
                                type="text"
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                                placeholder="Add a new todo"
                            />
                            <button onClick={addTodo}>Add Todo</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Wishlist
