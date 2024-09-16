import { useState } from "react";
import Card from "./Card";

export default function DashboardEditor({ dashboard }) {
    const [cards, setCards] = useState([]);

    return (
        <>
            {cards.map(card => (
                <Card card={card} />
            ))}
        </>
    )
}