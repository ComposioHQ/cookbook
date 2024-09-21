const Separator = ({ title }) => {
    return (
        <div className="flex items-center mb-6">
            <h1 className={`text-3xl font-bold text-gray-900 dark:text-white text-center mx-auto`}>{title}</h1>
        </div>
    );
};

export default Separator;