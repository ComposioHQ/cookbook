const Separator = ({ title }) => {
    return (
        <div className="flex items-center mb-6">
            <hr className="flex-grow border-t border-gray-300 dark:border-gray-700" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mx-4">{title}</h1>
            <hr className="flex-grow border-t border-gray-300 dark:border-gray-700" />
        </div>
    );
};

export default Separator;