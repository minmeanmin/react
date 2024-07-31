import React, { useEffect, useState } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, onSnapshot, query, orderBy, QuerySnapshot } from "firebase/firestore";
import { db } from '../firebase';
import Post from '../components/Post';

const Home = ({ userObj }) => {
    const [post, setPost] = useState('');
    const [posts, setPosts] = useState([]);

    // const getPosts = async () => {
    //     const querySnapshot = await getDocs(collection(db, "posts"));
    //     querySnapshot.forEach((doc) => {
    //         // console.log(doc.id, "=>", doc.data());
    //         const postObj = {
    //             ...doc.data(),
    //             id: doc.id
    //         }
    //         setPosts((prev) => [postObj, ...prev]);
    //     });
    // }

    useEffect(() => {
        // getPosts();
        const q = query(collection(db, "posts"), orderBy('date', 'desc'));
        onSnapshot(q, (querySnapshot) => {
            const postArr = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            })
            );
            setPosts(postArr);
        });
    }, [])

    const onChange = (e) => {
        const { target: { value } } = e;
        setPost(value);
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(db, "posts"), {
                content: post,
                date: serverTimestamp(),
                uid: userObj
            });
            console.log("Document written with ID: ", docRef.id);
            setPost('');
        } catch (e) {
            console.error("error:", e)
        }
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={post} type='text' placeholder='새 포스트를 입력하세요' onChange={onChange} />
                <button type='submit'>입력</button>
            </form>
            <hr />
            <h3>Post List</h3>
            <ul>
                {
                    posts.map(item => (
                        <Post key={item.id} postObj={item.content} />
                    ))
                }
            </ul>
        </div>
    )
}
export default Home;