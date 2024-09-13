import { Fragment, useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/UserContext";
import ContentBox from "./ContentBox";
import BoxTopbar from "./BoxTopbar";
import Markdown from 'markdown-to-jsx';
import MessageInputBox from "./MessageInputBox";
import { apiCall, claudeApiCall } from "../utils";

export default function Canvas({}) {
    const { user, setUser, authorize } = useAuth();
    const [boxes, setBoxes] = useState(initializeBoxes());
    const [creatingNewContext, setCreatingNewContext] = useState(false);
    const [error, setError] = useState(null);
    const mouseMoveListener = useRef(() => {});
    const mouseUpListener = useRef(() => {});

    function initializeBoxes() {
        const contexts = user.contexts;
        const result = [];

        for (let context of contexts) {
            const { _id, parent } = context;
            const visible = !parent;

            result.push({
                _id, visible,
                position: { x: 0, y: 0 },
                scale: { x: 200, y: 400 },
                backgroundColor: context.role === 'user' ? 'turquoise' : 'teal',
                topbarColor: 'cyan'
            });
        }

        return result;
    }

    useEffect(() => {
        setBoxes(initializeBoxes());
    }, [])

    function handleSave(id) {

    }

    const getOffset = (coord, clientCoord, box) => clientCoord - box.position[coord];

    function handleGrab(e, id) {
        const box = boxes.find(box => box._id === id);
        const offsetX = getOffset('x', e.clientX, box);
        const offsetY = getOffset('y', e.clientY, box);

        setBoxes(boxes => boxes.map(box => (
            box._id === id ? ({
                ...box,
                topbarColor: 'darkcyan'
            }) : box
        )));

        mouseMoveListener.current = e => {
            e.preventDefault();

            setBoxes(boxes => boxes.map(box => box._id === id ? (
                {
                    ...box,
                    position: {
                        x: e.clientX - offsetX,
                        y: e.clientY - offsetY
                    }
                }
            ) : box))
        };

        mouseUpListener.current = () => {
            window.removeEventListener('mousemove', mouseMoveListener.current);
            window.removeEventListener('mouseup', mouseUpListener.current);

            setBoxes(boxes => boxes.map(box => (
                box._id === id ? (
                    {
                        ...box,
                        topbarColor: 'cyan'
                    }
                ) : box
            )));
        };

        window.addEventListener('mouseup', mouseUpListener.current);
        window.addEventListener('mousemove', mouseMoveListener.current);
    }

    function handleRelease(id) {
        window.removeEventListener('mousemove', mouseMoveListener.current);
        mouseMoveListener.current = () => {};
    }

    async function handleNewContextSay(userText) {
        const token = authorize();
        const userContextData = {
            role: 'user',
            content: [{
                type: 'text',
                text: userText
            }],
            children: []
        };
        const claudeResponse = await apiCall('POST', '/claude', {
            model: 'claude-3-5-sonnet-20240620',
            max_tokens: 5000,
            messages: [{
                role: 'user',
                content: userContextData.content
            }]
        }, token);
        const responseContextData = {
            role: 'assistant',
            content: [{
                type: 'text',
                text: claudeResponse.content[0].text
            }]
        }
        const claudeApiResponse = await apiCall('POST', '/context', responseContextData, token)
        const apiResponse = await apiCall('POST', '/context', userContextData, token);

        if (apiResponse.error) {
            setError(apiResponse.type);
            return;
        }

        if (claudeResponse.error) {
            setError(claudeResponse.type);
            return;
        }

        setUser({
            ...user,
            contexts: [...user.contexts, apiResponse, claudeApiResponse]
        });

        setBoxes(initializeBoxes());
    }

    return (
        <>
            {boxes.map(box => {
                const context = user.contexts.find(context => (
                    context._id === box._id
                ));

                return (
                    <Fragment key={box._id}>
                        <ContentBox
                            position={box.position}
                            scale={box.scale}
                            backgroundColor={box.backgroundColor}
                        >
                            <BoxTopbar 
                                id={box._id}
                                name={context.name}
                                onSave={handleSave}
                                onGrab={handleGrab}
                                onRelease={handleRelease}
                                backgroundColor={box.topbarColor}
                            />
                            <p>
                                <Markdown>
                                    {context.content[0].text}
                                </Markdown>
                            </p>
                        </ContentBox>
                    </Fragment>
                )
            })}
            <button onClick={() => setCreatingNewContext(!creatingNewContext)}>
                {creatingNewContext ? 'Cancel' : 'New Context'}
            </button>
            {creatingNewContext && (
                <MessageInputBox onSay={handleNewContextSay} />
            )}
            {error && <p>{error}</p>}
        </>
    )
}