import { useOptionsContext } from "./OptionsMenu";

export default function OptionsMenuButton({ id, children }) {
    const { showOptions, onClick } = useOptionsContext();

    return (
        <div 
            onClick={() => onClick(id)}
            style={{ 
                display: showOptions ? 'block' : 'none',
                cursor: 'pointer' 
            }}
        >
            {children}
        </div>
    )
} 