'use client'
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
const CheckToken = () => {
    const router = useRouter();
    const token = localStorage.getItem('token');
    if (!token) {
        router.push('/login');
        return false;
    }
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    if (!decoded.exp || decoded.exp < now) {
        localStorage.removeItem('token');
        router.push('/login');
        return false;
    }
    return true;
}

export default CheckToken;