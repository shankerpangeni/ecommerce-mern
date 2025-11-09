'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { showAlert } from '@/app/store/slices/alertSlice';
import { setUser } from '@/app/store/slices/authSlice';
import { setCart } from '@/app/store/slices/cartSlice';
import api from '@/lib/api';

const Login = () => {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        document.title = "Login | JobHunt";
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // 1️⃣ Login API call
            const res = await api.post('/api/v1/user/login', formData);

            if (res.data.success) {
                const user = res.data.user;
                dispatch(showAlert({ type: 'success', message: res.data.message }));
                dispatch(setUser(user));

                // 2️⃣ Fetch user's cart after login
                try {
                    const cartRes = await api.get('/api/v1/cart', {
                        headers: { Authorization: `Bearer ${res.data.token}` } // pass JWT if needed
                    });

                    if (cartRes.data.success && cartRes.data.cart) {
                        const formattedCart = {
                        items: cartRes.data.cart.products.map(p => ({
                            productId: p.product._id,
                            name: p.product.name,   // make sure your Product model has `name`
                            price: p.product.price, // make sure your Product model has `price`
                            quantity: p.quantity,
                            productTotal: p.productTotal
                        })),
                        total: cartRes.data.cart.total
                        };

                        dispatch(setCart(formattedCart)); // populate Redux cart
                    }
                    } catch (cartError) {
                    console.error("Failed to fetch cart:", cartError);
                }

                // 3️⃣ Redirect based on role
                if (user.role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
            } else {
                setError(res.data.message || 'Login failed');
                dispatch(showAlert({ type: 'error', message: res.data.message || 'Login failed' }));
            }

        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Login failed due to a network error.";
            setError(message);
            dispatch(showAlert({ type: 'error', message }));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen flex justify-center items-center bg-gray-200'>
            <div className='flex flex-col bg-white w-[90%] sm:w-[80%] md:w-[60%] lg:w-[25%] border-2 border-blue-900 rounded-lg p-4 gap-5 shadow-lg'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                    <div className="flex justify-center items-center ">
                        <span className='text-3xl font-semibold text-blue-950'>Login</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className='text-xl'>Email:</label>
                        <input type="email" name='email' value={formData.email} onChange={handleChange} className='border-2 border-solid rounded-lg p-2 w-full' placeholder='Enter your email' required />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className='text-xl'>Password:</label>
                        <input type="password" name='password' value={formData.password} onChange={handleChange} className='border-2 border-solid rounded-lg p-2 w-full' placeholder='Enter your password' required />
                    </div>

                    <div className="flex flex-col">
                        <button type="submit" disabled={loading} className='bg-blue-950 text-white p-3 text-xl rounded-xl font-medium border-2 border-blue-950 cursor-pointer hover:text-blue-950 hover:bg-white hover:border-2 hover:border-blue-950 hover:transition-all duration-300'>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>

                {error && <div className="flex justify-center items-center">
                    <span className='text-md text-red-600'>{error}</span>
                </div>}

                <div className="flex justify-center items-center">
                    <span className='text-base'>Don't have an account? <Link href="/signup" className="font-semibold text-blue-950 border-b cursor-pointer">Register</Link></span>
                </div>
            </div>
        </div>
    )
}

export default Login;
