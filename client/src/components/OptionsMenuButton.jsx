import { useOptionsContext } from "./OptionsMenu";

export default function OptionsMenuButton({ id, children }) {
    const onClick = useOptionsContext();

    return (
        <div 
            onClick={() => onClick(id)}
            style={{ cursor: 'pointer' }}
        >
            {children}
        </div>
    )
} 