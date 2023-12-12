import React, { useEffect, useMemo, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import axios from 'axios';

export default function Main() {
    const point = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const [allFeedbacks, setAllFeedbacks] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [id, setId] = useState(null);
    const [feedback, setFeedback] = useState({
        value: null,
        text: ''
    })
    const fetchData = async () => {
        let res = await axios.get("http://localhost:8000/api/v1/feedbacks");
        setAllFeedbacks(res.data);
    }
    useEffect(() => {
        fetchData();
    }, [])
    const choosePoint = (point) => {
        setFeedback({ ...feedback, value: point == feedback.value ? null : point });
    }
    const total = useMemo(() => {
        return (allFeedbacks.reduce((a, b) => a + b.value, 0) / allFeedbacks.length).toFixed(1);
    }, [allFeedbacks])
    const handleClick = async () => {
        if (feedback.value == null) {
            alert("You must choose point");
        } else if (feedback.text.length <= 0) {
            alert("You should write anything");
        } else {
            try {
                let res;
                if (!isEdit) {
                    res = await axios.post("http://localhost:8000/api/v1/feedbacks", {
                        ...feedback,
                        id: Math.floor(Math.random() * 999)
                    });
                } else {
                    let feedbackByiD = allFeedbacks.find(e => e.id == id);
                    res = await axios.put(`http://localhost:8000/api/v1/feedbacks/${id}`, {
                        ...feedbackByiD,
                        ...feedback
                    })
                    setIsEdit(false);
                }
                setAllFeedbacks(res.data.data)
                setFeedback({
                    value: null,
                    text: ''
                })
            } catch (error) {
                console.log(error);
            }
        }
    }
    const handleEdit = (value) => {
        setIsEdit(true);
        setId(value.id);
        setFeedback(value)
    }
    const handleDelete = async (id) => {
        try {
            let res = await axios.delete(`http://localhost:8000/api/v1/feedbacks/${id}`);
            setAllFeedbacks(res.data.data)
        } catch (error) {   
            console.log(error);
        }
    }
    return (
        <>
            <div>
                <div className='bg-black text-red-400 font-bold text-2xl text-center' >
                    <div className='py-3'>Feedback TA</div>
                </div>
                <div className='bg-slate-600' style={{ minHeight: '676px' }}>
                    <div className='py-5 px-80 flex justify-center flex-col'>
                        <div className='bg-white rounded-md py-4 px-8'>
                            <div className='flex justify-center flex-col text-center'>
                                <div>Thay phu day anh em co hay khong???</div>
                                <div className='flex gap-4 justify-center my-6'>
                                    {point.map((i) => {
                                        return <button style={{ backgroundColor: feedback.value == i ? 'rgb(255,153,187)' : 'rgb(217,213,212)', color: feedback.value == i ? 'white' : '' }} className='hover:bg-red-300 hover:text-white rounded-full w-[55px] h-[55px]' key={i} onClick={() => choosePoint(i)}>
                                            <div className='text-center'>{i}</div>
                                        </button>
                                    })}
                                </div>
                                <div className='relative px-12 p-2'>
                                    <input type="text" placeholder='Write a review' className='w-full pl-3 py-3.5 pr-24 border border-black rounded-md' value={feedback.text} onChange={(e) => setFeedback({ ...feedback, text: e.target.value })} />
                                    <button className='absolute bg-slate-300' style={{ marginTop: '5px', right: '55px' }} onClick={handleClick}>{isEdit ? "Edit" : "Send"}</button>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-between py-2.5 text-white font-bold'>
                            <div>{allFeedbacks.length} Reviews</div>
                            <div>Average Rating: {total}</div>
                        </div>
                        <div className='flex flex-col gap-y-4'>
                            {allFeedbacks.map((e, i) => (
                                <div className='relative mt-2' key={e.id}>
                                    <div className='py-2 w-12 bg-red-400 text-white border border-white absolute rounded-sm' style={{ borderRadius: '50%', marginTop: '-10px', marginLeft: '-25px' }}>
                                        <div className='text-center'>{e.value}</div>
                                    </div>
                                    <div className='w-full bg-white text-black py-2.5 pl-12 pr-2 rounded-md font-semibold flex justify-between items-center'>
                                        <div>{e.text}</div>
                                        <div className='flex gap-2'>
                                            <button onClick={() => handleEdit(e)}><FaEdit /></button>
                                            <button onClick={() => handleDelete(e.id)}><FaX /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
