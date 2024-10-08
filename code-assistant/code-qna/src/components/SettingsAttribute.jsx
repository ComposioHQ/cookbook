import SmallButton from "./SmallButton";
import { Audio } from 'react-loader-spinner'
import 'rsuite/Loader/styles/index.css';
import { Loader } from 'rsuite';

const SettingsAttribute = ({ type, displayName, value, linkAction, loading, buttonName="Link", showButton=true, textArea=false, onChangeFunction, readOnly=true, nolabel=false, placeholder="", id="" }) => {
    return <div className={`flex items-center gap-4 ${nolabel ? 'w-full' : ''}`} id={id}>
        {!nolabel && <label htmlFor={type} className="text-left block text-lg font-medium text-gray-900 dark:text-white">{displayName}: </label>}
        {textArea ? <textarea
            id={type}
            className="ml-auto focus:outline-none block py-1.5 px-3 w-1/2 text-md text-gray-500 bg-gray-50 rounded-lg border border-gray-300 "
            placeholder={value}
            onChange={(e) => {
                onChangeFunction(e.target.value);
            }}
        ></textarea> : <input
            readOnly={readOnly}
            className={`h-[2.5rem] block ${nolabel ? 'w-full' : 'w-1/2'} ml-auto rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 py-1.5 px-3 focus:outline-none`}
            placeholder={value}
            onChange={(e) => {
                onChangeFunction(e.target.value);
            }}
            autoComplete="off"
        ></input>}
        {showButton && <SmallButton
            name={loading ? <Loader speed="slow" size="sm" /> : buttonName}
            action={linkAction}
        />}
    </div>
}

export default SettingsAttribute;