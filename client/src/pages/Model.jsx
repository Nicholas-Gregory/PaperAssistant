import { useState } from "react";
import { useSettings } from "../contexts/SettingsContext";

export default function Model() {
    const [settings, setSettings] = useSettings();

    return (
        <center style={{ margin: '5px' }}>
            <form
                id="settings-form"
                onSubmit={e => e.preventDefault()}
            >
                <label htmlFor="model-select">
                    Model Name: &nbsp;
                </label>
                <select 
                    id="model-select"
                    value={settings.model}
                    onChange={e => setSettings({
                        ...settings,
                        model: e.target.value
                    })}
                >
                    <option value={'claude-3-5-sonnet-20240620'}>
                        Claude 3.5 Sonnet
                    </option>
                    <option value={'claude-3-opus-20240229'}>
                        Claude 3 Opus
                    </option>
                    <option value={'claude-3-sonnet-20240229'}>
                        Claude 3 Sonnet
                    </option>
                    <option value={'claude-3-haiku-20240307'}>
                        Claude 3 Haiku
                    </option>
                </select>
                <br />
                <br />
                <label htmlFor="max-tokens-select">
                    Default Max Tokens: &nbsp;
                </label>
                <input
                    type="number"
                    value={settings.max_tokens}
                    onChange={e => setSettings({
                        ...settings,
                        max_tokens: e.target.value
                    })}
                />
            </form>
        </center>
    )
}