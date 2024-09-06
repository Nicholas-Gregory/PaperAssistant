import { useAuth } from "../contexts/UserContext";

export default function ContextBar() {
    const { user } = useAuth();
}